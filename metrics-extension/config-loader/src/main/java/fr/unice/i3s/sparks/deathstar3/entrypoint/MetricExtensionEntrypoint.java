package fr.unice.i3s.sparks.deathstar3.entrypoint;

import configuration.Configuration;
import configuration.ParametersObject;
import entrypoint.Symfinder;
import fr.unice.i3s.sparks.deathstar3.CommandRunner;
import fr.unice.i3s.sparks.deathstar3.MetricGatherer;
import fr.unice.i3s.sparks.deathstar3.model.Config;
import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.Compiler;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.SonarQubeStarter;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.SourceFetcher;

import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import io.netty.util.concurrent.SingleThreadEventExecutor;
import neograph.NeoGraph;
import org.apache.shiro.crypto.hash.Hash;
import org.eclipse.jgit.api.errors.GitAPIException;
import result.SymfinderResult;
import visitors.SymfinderVisitor;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

public class MetricExtensionEntrypoint {


    ExecutorService executor = Executors.newFixedThreadPool(1);
    private final SourceFetcher sourceFetcher=new SourceFetcher();
    private final SonarQubeStarter sonarQubeStarter=new SonarQubeStarter();
    private final Compiler compiler=new Compiler();
    private final MetricGatherer metricGatherer = new MetricGatherer();
    public void doEverything(Config config , ParametersObject symfinderConfig) throws GitAPIException, IOException, InterruptedException, ExecutionException {
        Map<String , List<Node>> metricsResult=new HashMap<>();
        config.setRepositoryUrl( this.sourceFetcher.normalizeRepositoryUrl(config.getRepositoryUrl()));

      List<String> repositories = sourceFetcher.cloneRepository(config);

        Thread qualityMetrics=null;
      if(config.isSonarqubeNeeded()){
          qualityMetrics=new Thread(()->{
              sonarQubeStarter.startSonarqube();
              compiler.executeProject(config);
          });

      }

      Path workingDirectory= Files.createTempDirectory("varicity-work-dir");
      String repositoryPath=repositories.get(0);
      config.setPath(repositoryPath);
      Future<SymfinderResult> futureSymfinderResult= executor.submit((Callable<SymfinderResult>) () -> {
         return new Symfinder(repositoryPath, workingDirectory.toString(), new Configuration(symfinderConfig)).run();
      });




      if(qualityMetrics!=null){
          qualityMetrics.join();
      }


    if(config.getSources()!=null){

        for (MetricSource source : config.getSources()) {
            List<Node> nodes1= metricGatherer.gatherMetrics(config.getProjectName(), workingDirectory.toString(),source);
            if(!nodes1.isEmpty()){
                metricsResult.put(source.getName(), nodes1 );
            }
        }
    }

    futureSymfinderResult.get();

    if(!metricsResult.isEmpty()){
        //send it
    }




    }
}
