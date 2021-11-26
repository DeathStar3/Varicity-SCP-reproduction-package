package fr.unice.i3s.sparks.deathstar3.entrypoint;

import configuration.Configuration;
import configuration.HotspotsParameters;
import configuration.Neo4jParameters;
import configuration.ParametersObject;
import entrypoint.Symfinder;
import fr.unice.i3s.sparks.deathstar3.MetricGatherer;
import fr.unice.i3s.sparks.deathstar3.model.Config;
import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.junit.jupiter.api.Test;
import result.SymfinderResult;

import java.io.IOException;
import java.util.List;

public class MetricExtensionEntrypointTest {


    private MetricExtensionEntrypoint entrypoint=new MetricExtensionEntrypoint();
    private MetricGatherer metricGatherer=new MetricGatherer();

    private Config jfreeChart = new Config("jfreechart", "/tmp/varicity-xp-projects", "", "maven",
            "3.8.2-jdk-11", List.of("mvn", "clean", "install", "sonar:sonar", "-f", "/project/pom.xml", "-DskipTests=true"),
            "http://sonarqubehost:9000", true);

    @Test
    void doEverythingTest() throws GitAPIException, IOException {

        /*jfreeChart.setTagIds(List.of("v1.5.0"));

        jfreeChart.setRepositoryUrl("https://github.com/jfree/jfreechart.git");

        MetricSource metricSource=new MetricSource();
        metricSource.setName("sonarqube");
        metricSource.setMetrics(List.of("complexity","cognitive_complexity"));

        metricSource.setEnabled(true);
        metricSource.setComponentName(jfreeChart.getProjectName());
        metricSource.setRootUrl("http://localhost:9000");

        jfreeChart.setSources(List.of(metricSource));

        //this.entrypoint.doEverything(jfreeChart);
        */


        ParametersObject parametersObject=new ParametersObject(new Neo4jParameters("bolt://localhost:7687","neo4j","Practical back up Movies 48"),
                new HotspotsParameters(20,5),"");



        SymfinderResult result= new Symfinder("/home/anagonou/Documents/si5/ter/cookiefactory-20-21-team-o", "/home/anagonou/Documents/si5/ter/cookiefactory-20-21-team-o.json", new Configuration( parametersObject ) ).run();

        System.out.println(result);
        //new Symfinder("/tmp/varicity-xp-projects/jfreechart-v1.5.0", "/tmp/varicity-xp-projects").run();
       // this.metricGatherer.gatherMetrics("jfreechart", "/tmp/varicity-work-dir9081779513887105804", metricSource);
    }


}
