/*
 * This file is part of symfinder.
 *
 *  symfinder is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  symfinder is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 *  Copyright 2018-2021 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 *  Copyright 2018-2021 Xhevahire Tërnava <t.xheva@gmail.com>
 *  Copyright 2018-2021 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

package fr.unice.i3s.sparks.deathstar3.entrypoint;

import fr.unice.i3s.sparks.deathstar3.MetricGatherer;
import fr.unice.i3s.sparks.deathstar3.deserializer.ExperimentResultReader;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.Compiler;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.Constants;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.Neo4JStarter;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.SonarQubeStarter;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import fr.unice.i3s.sparks.deathstar3.sourcesfetcher.SourceFetcher;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration.Configuration;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration.HotspotsParameters;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration.Neo4jParameters;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration.ParametersObject;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.result.SymfinderResult;
import fr.unice.i3s.sparks.deathstar3.util.SonarFileSanitizer;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.errors.GitAPIException;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Slf4j
public class MetricExtensionEntrypoint {

    private final ExecutorService executor = Executors.newFixedThreadPool(2);
    private final SourceFetcher sourceFetcher;
    private final SonarQubeStarter sonarQubeStarter;
    private final Compiler compiler = new Compiler();
    private final MetricGatherer metricGatherer = new MetricGatherer();
    private final Neo4JStarter neo4JStarter = new Neo4JStarter();

    public MetricExtensionEntrypoint() {

        this.sourceFetcher = new SourceFetcher();
        sonarQubeStarter = new SonarQubeStarter();
    }

    public synchronized List<ExperimentResult> runExperiment(ExperimentConfig experimentConfig, HotspotsParameters hotspotsParameters) {

        List<String> allVersions = new ArrayList<>();

        if (experimentConfig.getTagIds() != null && !experimentConfig.getTagIds().isEmpty()) {
            allVersions.addAll(experimentConfig.getTagIds());
        }

        if (experimentConfig.getCommitIds() != null && !experimentConfig.getCommitIds().isEmpty()) {
            allVersions.addAll(experimentConfig.getCommitIds());
        }

        if (allVersions.size() > 1) {
            List<ExperimentResult> allResults = new ArrayList<>();
            List<ExperimentConfig> allExperimentConfigVariants = new ArrayList<>();
            for (String version : allVersions) {

                ExperimentConfig experimentConfigVariant = experimentConfig.cloneSelf();
                experimentConfigVariant.setProjectName(experimentConfig.getProjectName() + "-" + version);
                experimentConfigVariant.setTagIds(Set.of(version));
                experimentConfigVariant.changeComponentNameOfLocalMetricSource(experimentConfigVariant.getProjectName());

                allExperimentConfigVariants.add(experimentConfigVariant);
            }

            for (ExperimentConfig configVariant : allExperimentConfigVariants) {
                try {
                    allResults.add(this.runSimpleExperiment(configVariant, hotspotsParameters));
                } catch (Exception e) {
                    e.printStackTrace();
                    //TODO collect all exceptions of each variant that failed and return them
                }
            }

            return allResults;
        } else {
            return List.of(this.runSimpleExperiment(experimentConfig, hotspotsParameters));
        }

    }

    synchronized ExperimentResult runSimpleExperiment(ExperimentConfig config, HotspotsParameters hotspotsParameters) {
        try {
            makePathAbsoluteIfNotAlready(config);
            return this.runExperimentInternal(config, hotspotsParameters);
        } catch (Exception exception) {
            throw new RuntimeException(exception);
        }
    }

    private ExperimentResult runExperimentInternal(ExperimentConfig config, HotspotsParameters hotspotsParameters)
            throws GitAPIException, IOException, InterruptedException, ExecutionException {

        Map<String, List<Node>> metricsResult = new HashMap<>();
        if (config.getPath() == null || config.getPath().isBlank()) {// imply  skipClone is false
            config.setPath(Files.createTempDirectory("varicity-xp-projects").toString());
        }

        // if the output path is not defined a temporary one is created
        if (config.getOutputPath() == null || config.getOutputPath().isBlank()) {
            try {
                Path workingDirectory = Files.createTempDirectory("varicity-work-dir");
                config.setOutputPath(workingDirectory.toAbsolutePath().toString());
            } catch (Exception e) {
                e.printStackTrace();
            }

        }

        String repositoryPath = config.getPath();
        if (!config.isSkipClone()) {
            config.setRepositoryUrl(this.sourceFetcher.normalizeRepositoryUrl(config.getRepositoryUrl()));
            List<String> repositories = sourceFetcher.cloneRepository(config);
            repositoryPath = repositories.get(0);
        }

        Future<Boolean> compilationFuture = null;
        if (config.isSonarqubeNeeded()) {
            compilationFuture = executor.submit(() -> {

                if (!sonarQubeStarter.startSonarqube()) {

                    return false;
                }
                log.trace("SonarQube started");
                if (!compiler.executeProject(config)) {

                    return false;
                }
                //the update of sonarqube is not immediate, the sleep introduce a delay so that the update of sonarqube is done before
                //MetricGatherer is called
                try {
                    Thread.sleep(30_000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return true;
            });
        }

        config.setPath(repositoryPath);
        String finalRepositoryPath = repositoryPath;

        Future<SymfinderResult> futureSymfinderResult;

        //ignorer l'analyse avec Symfinder si demandé par l'utilisateur

        if (config.isSkipSymfinder()) {
            futureSymfinderResult = CompletableFuture.completedFuture(new ExperimentResultReader(config, config.getProjectName()).getSymfinderResultFromExistingAnalysis());
        } else {
            futureSymfinderResult = executor.submit(() -> {
                System.out.println("Starting Neo4J container this may take some time ....");
                Neo4jParameters neo4jParameters = neo4JStarter.startNeo4J();
                return new Symfinder(finalRepositoryPath, new Configuration(new ParametersObject(neo4jParameters, hotspotsParameters, ""))).run();
            });
        }

        boolean localSonarqubeIsReady = false;

        if (compilationFuture != null) {
            localSonarqubeIsReady = compilationFuture.get();
        }

        if (config.getSources() != null) {

            for (MetricSource source : config.getSources()) {

                if (source.getName().equals("sonarqube")) {
                    source.setRootUrl(Constants.SONARQUBE_LOCAL_URL);
                }

                if (source.getName().equals("sonarqube") && !localSonarqubeIsReady) {
                    continue;
                }
                List<Node> nodes1 = metricGatherer.gatherMetrics(config.getProjectName(), source);
                if (!nodes1.isEmpty()) {
                    metricsResult.put(source.getName(), nodes1);
                }

            }

        }

        sanitizeMetricsResults(metricsResult, finalRepositoryPath);

        return new ExperimentResult(config.getProjectName(), futureSymfinderResult.get(), metricsResult, config);
    }

    private void sanitizeMetricsResults(Map <String, List <Node>> metricsResult, String finalRepositoryPath) {
        for (Map.Entry <String, List <Node>> projectEntry : metricsResult.entrySet()) {
            projectEntry.setValue(new SonarFileSanitizer(projectEntry.getValue(), finalRepositoryPath).getSanitizedOutput());
        }
    }


    private void makePathAbsoluteIfNotAlready(ExperimentConfig experimentConfig) {

        if (experimentConfig.getPath() == null || experimentConfig.getPath().isBlank()) {
            //if the path is not provided we will use a temporary directory
            return;
        }
        Path pathProvided = Paths.get(experimentConfig.getPath());

        if (!pathProvided.isAbsolute()) {
            experimentConfig.setPath(Path.of(System.getProperty("user.dir"), experimentConfig.getPath()).toAbsolutePath().toString());
        }
    }


}
