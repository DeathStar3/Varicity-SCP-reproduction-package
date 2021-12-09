package fr.unice.i3s.sparks.deathstar3.entrypoint;

import java.io.IOException;
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

import org.eclipse.jgit.api.errors.GitAPIException;

import fr.unice.i3s.sparks.deathstar3.MetricGatherer;
import fr.unice.i3s.sparks.deathstar3.engine.configuration.Configuration;
import fr.unice.i3s.sparks.deathstar3.engine.configuration.HotspotsParameters;
import fr.unice.i3s.sparks.deathstar3.engine.configuration.Neo4jParameters;
import fr.unice.i3s.sparks.deathstar3.engine.configuration.ParametersObject;
import fr.unice.i3s.sparks.deathstar3.engine.entrypoint.Symfinder;
import fr.unice.i3s.sparks.deathstar3.engine.result.SymfinderResult;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.Compiler;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.Constants;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.Neo4JStarter;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.SonarQubeStarter;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import fr.unice.i3s.sparks.deathstar3.sourcesfetcher.SourceFetcher;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MetricExtensionEntrypoint {

    private final ExecutorService executor = Executors.newFixedThreadPool(2);
    private final SourceFetcher sourceFetcher;
    private final SonarQubeStarter sonarQubeStarter;
    private final Compiler compiler = new Compiler();
    private final MetricGatherer metricGatherer = new MetricGatherer();
    private final Neo4JStarter neo4JStarter=new Neo4JStarter();

    public MetricExtensionEntrypoint(){

        this.sourceFetcher = new SourceFetcher();
        sonarQubeStarter = new SonarQubeStarter();
    }

    public synchronized List<ExperimentResult> runExperiment(ExperimentConfig experimentConfig, HotspotsParameters hotspotsParameters){

        List<String> allVersions = new ArrayList<>();

        if (experimentConfig.getTagIds() != null && !experimentConfig.getTagIds().isEmpty()) {
            allVersions.addAll(experimentConfig.getTagIds());
        }

        if (experimentConfig.getCommitIds() != null && !experimentConfig.getCommitIds().isEmpty()) {
            allVersions.addAll(experimentConfig.getCommitIds());
        }

        if(allVersions.size() > 1){
            List<ExperimentResult> allResults=new ArrayList<>();
            List<ExperimentConfig> allExperimentConfigVariants=new ArrayList<>();
            for(String version:allVersions){

                ExperimentConfig experimentConfigVariant= experimentConfig.cloneSelf();
                experimentConfigVariant.setProjectName(experimentConfig.getProjectName()+"-"+version);
                experimentConfigVariant.setTagIds(Set.of(version));
                experimentConfigVariant.changeComponentNameOfLocalMetricSource(experimentConfigVariant.getProjectName());

                allExperimentConfigVariants.add(experimentConfigVariant);
            }

            for(ExperimentConfig configVariant:allExperimentConfigVariants){
                try {
                    allResults.add(this.runSimpleExperiment(configVariant,hotspotsParameters));
                }
                catch (Exception e){
                    e.printStackTrace();
                    //TODO collect all exceptions of each variant that failed and return them
                }
            }

            return  allResults;
        }
        else{
            return List.of(this.runSimpleExperiment(experimentConfig,hotspotsParameters));
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
            futureSymfinderResult = CompletableFuture.completedFuture(new SymfinderResult("", ""));
        } else {
            futureSymfinderResult = executor.submit(() -> {
                System.out.println("Starting Neo4J container this may take some time ....");
                Neo4jParameters neo4jParameters= neo4JStarter.startNeo4J();
                return new Symfinder(finalRepositoryPath, new Configuration( new ParametersObject(neo4jParameters, hotspotsParameters, "" ) )).run();
            });
        }

        boolean localSonarqubeIsReady = false;

        if (compilationFuture != null) {
            localSonarqubeIsReady = compilationFuture.get();
        }

        if (config.getSources() != null) {

            for (MetricSource source : config.getSources()) {

                if(source.getName().equals("sonarqube")){
                    source.setRootUrl(Constants.getSonarqubeLocalUrl());
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

        return new ExperimentResult(config.getProjectName(), futureSymfinderResult.get(), metricsResult);
    }


    private void makePathAbsoluteIfNotAlready(ExperimentConfig experimentConfig){

        if(experimentConfig.getPath()==null || experimentConfig.getPath().isBlank()){
            //if the path is not provided we will use a temporary directory
            return;
        }
        Path pathProvided= Paths.get(experimentConfig.getPath());

        if(!pathProvided.isAbsolute()){
            experimentConfig.setPath( Path.of(System.getProperty("user.dir"), experimentConfig.getPath()).toAbsolutePath().toString());
        }
    }



}
