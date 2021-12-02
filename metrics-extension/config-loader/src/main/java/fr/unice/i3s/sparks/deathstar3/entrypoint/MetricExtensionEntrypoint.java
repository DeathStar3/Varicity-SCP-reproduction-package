package fr.unice.i3s.sparks.deathstar3.entrypoint;

import fr.unice.i3s.sparks.deathstar3.MetricGatherer;
import fr.unice.i3s.sparks.deathstar3.engine.configuration.Configuration;
import fr.unice.i3s.sparks.deathstar3.engine.configuration.ParametersObject;
import fr.unice.i3s.sparks.deathstar3.engine.entrypoint.Symfinder;
import fr.unice.i3s.sparks.deathstar3.engine.result.SymfinderResult;
import fr.unice.i3s.sparks.deathstar3.logging.DefaultSymfinderLogger;
import fr.unice.i3s.sparks.deathstar3.logging.ISymfinderLogger;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.Compiler;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.SonarQubeStarter;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import fr.unice.i3s.sparks.deathstar3.sourcesfetcher.SourceFetcher;
import org.eclipse.jgit.api.errors.GitAPIException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

public class MetricExtensionEntrypoint {

    private final ExecutorService executor = Executors.newFixedThreadPool(1);
    private final SourceFetcher sourceFetcher;
    private final SonarQubeStarter sonarQubeStarter;
    private final Compiler compiler = new Compiler();
    private final MetricGatherer metricGatherer = new MetricGatherer();
    private final ISymfinderLogger logger;

    public MetricExtensionEntrypoint(){
        this.logger = new DefaultSymfinderLogger();
        this.sourceFetcher = new SourceFetcher(this.logger);
        sonarQubeStarter = new SonarQubeStarter(this.logger);
    }


    public MetricExtensionEntrypoint(ISymfinderLogger logger){
        if(logger == null){
            this.logger= new DefaultSymfinderLogger();
        }
        else{
            this.logger=logger;
        }

        this.sourceFetcher = new SourceFetcher(this.logger);
        sonarQubeStarter = new SonarQubeStarter(this.logger);
    }



    public ExperimentResult runExperiment(ExperimentConfig config, ParametersObject symfinderConfig) {
        try {
            makePathAbsoluteIfNotAlready(config);
            return this.runExperimentInternal(config, symfinderConfig);
        } catch (Exception exception) {
            throw new RuntimeException(exception);
        }
    }

    private ExperimentResult runExperimentInternal(ExperimentConfig config, ParametersObject symfinderConfig)
            throws GitAPIException, IOException, InterruptedException, ExecutionException {

        Map<String, List<Node>> metricsResult = new HashMap<>();

        if (config.getPath() == null || config.getPath().isBlank()) {// imply  skipClone is false
            config.setPath(Files.createTempDirectory("varicity-xp-projects").toString());
        }

        String repositoryPath = config.getPath();
        if (!config.isSkipClone()) {
            config.setRepositoryUrl(this.sourceFetcher.normalizeRepositoryUrl(config.getRepositoryUrl()));
            List<String> repositories = sourceFetcher.cloneRepository(config);
            repositoryPath = repositories.get(0);// We assume one tagId or commitId per project
        }

        Thread qualityMetrics = null;
        if (config.isSonarqubeNeeded()) {
            qualityMetrics = new Thread(() -> {
                sonarQubeStarter.startSonarqube();
                compiler.executeProject(config);
                //the update of sonarqube is not immediate, the sleep introduce a dealy so that the update of sonarqube is done before
                //MetricGatherer is called
                try {
                    Thread.sleep(30_000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
            qualityMetrics.start();
        }

        Path workingDirectory;

        // if the output path is not defined a temporary one is created
        if (config.getOutputPath() == null || config.getOutputPath().isBlank()) {
            workingDirectory = Files.createTempDirectory("varicity-work-dir");
            config.setOutputPath(workingDirectory.toAbsolutePath().toString());
        } else {
            workingDirectory = Path.of(config.getOutputPath());
        }

        config.setPath(repositoryPath);
        String finalRepositoryPath = repositoryPath;
        Path finalWorkingDirectory = workingDirectory;
        Future<SymfinderResult> futureSymfinderResult;

        //ignorer l'analyse avec Symfinder si demandé par l'utilisateur

        if (config.isSkipSymfinder()) {
            futureSymfinderResult = CompletableFuture.completedFuture(new SymfinderResult("", ""));
        } else {
            futureSymfinderResult = executor.submit(() -> {
                return new Symfinder(finalRepositoryPath, finalWorkingDirectory + "/symfinder/result.json",
                        new Configuration(symfinderConfig)).run();
            });
        }

        if (qualityMetrics != null) {
            qualityMetrics.join();
        }

        if (config.getSources() != null) {

            for (MetricSource source : config.getSources()) {

                List<Node> nodes1 = metricGatherer.gatherMetrics(config.getProjectName(), workingDirectory.toString(),
                        source);
                if (!nodes1.isEmpty()) {
                    metricsResult.put(source.getName(), nodes1);
                }
            }
        }

        return new ExperimentResult(config.getProjectName(), futureSymfinderResult.get(), metricsResult);
    }


    private void makePathAbsoluteIfNotAlready(ExperimentConfig experimentConfig){
        Path pathProvided= Paths.get(experimentConfig.getPath());

        if(pathProvided.isAbsolute()){
            return;
        }
        else{
           experimentConfig.setPath( Path.of(System.getProperty("user.dir"), experimentConfig.getPath()).toAbsolutePath().toString());
        }
    }
}
