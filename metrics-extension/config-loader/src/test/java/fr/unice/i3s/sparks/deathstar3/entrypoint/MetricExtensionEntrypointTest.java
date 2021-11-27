package fr.unice.i3s.sparks.deathstar3.entrypoint;

import fr.unice.i3s.sparks.deathstar3.configuration.Configuration;
import fr.unice.i3s.sparks.deathstar3.configuration.HotspotsParameters;
import fr.unice.i3s.sparks.deathstar3.configuration.Neo4jParameters;
import fr.unice.i3s.sparks.deathstar3.configuration.ParametersObject;
import fr.unice.i3s.sparks.deathstar3.MetricGatherer;
import fr.unice.i3s.sparks.deathstar3.model.Config;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import fr.unice.i3s.sparks.deathstar3.result.SymfinderResult;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class MetricExtensionEntrypointTest {


    private MetricExtensionEntrypoint entrypoint=new MetricExtensionEntrypoint();
    private MetricGatherer metricGatherer=new MetricGatherer();

    private Config cfclient = new Config("CookieFactoryClient", "/home/anagonou/Documents/si5/ter/4A_ISA_TheCookieFactory/client", "", "maven",
            "3.8-openjdk-8", List.of("mvn", "clean", "install", "-f", "/project/pom.xml", "-DskipTests=true"),
            "http://sonarqubehost:9000", false);

    @Test
    void doEverythingTest() throws GitAPIException, IOException, ExecutionException, InterruptedException {
        ParametersObject parametersObject=new ParametersObject(new Neo4jParameters("bolt://localhost:7687","",""),
                new HotspotsParameters(20,5),"");

        cfclient.setSkipClone(true);

        cfclient.setTagIds(List.of("v1.5.0"));

        cfclient.setRepositoryUrl("https://github.com/jfree/jfreechart.git");

        cfclient.setSonarqubeNeeded(true);

        cfclient.setOutputPath("/home/anagonou/Documents/si5/ter/4A_ISA_TheCookieFactory/client");

        MetricSource metricSource=new MetricSource();
        metricSource.setName("sonarqube");
        metricSource.setMetrics(List.of("complexity","cognitive_complexity"));

        metricSource.setEnabled(true);
        metricSource.setComponentName(cfclient.getProjectName());
        metricSource.setRootUrl("http://localhost:9000");

        cfclient.setSources(List.of(metricSource));

        Assertions.assertDoesNotThrow(()->{
            ExperimentResult experimentResult= this.entrypoint.doEverything(cfclient, parametersObject));
            Assertions.assertNotNull(experimentResult);
       Assertions.assertFalse(experimentResult.externalMetric().isEmpty());
        });


    }


}
