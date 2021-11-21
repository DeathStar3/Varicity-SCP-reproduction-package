package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DockerClientBuilder;

import fr.unice.i3s.sparks.deathstar3.exceptions.PullException;
import fr.unice.i3s.sparks.deathstar3.model.Config;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class CompilerTest {

    private SonarqubeStarter sonarqubeStarter = new SonarqubeStarter();

    private Compiler compiler = new Compiler();

    private Config jfreeChart = new Config("jfreechart", "/tmp/varicity-xp-projets/jfreechart", "", "maven",
            "3.8.2-jdk-11", List.of("mvn", "clean", "install", "sonar:sonar", "-f", "/project/pom.xml"),
            "http://sonarqubehost:9000", true);

    private Config junit = new Config("junit", "/tmp/varicity-xp-projects/junit", "", "maven", "3.8.2-jdk-11",
            List.of("mvn", "clean", "install", "sonar:sonar", "-f", "/project/pom.xml"), "http://sonarqubehost:9000",
            true);

    @Test
    public void getTokenTest() throws JsonProcessingException {
        var result = compiler.getToken("my_vezdzhdgreatest_name", "http://localhost:9000");
        System.out.println(result);
        assertNotNull(result);

    }

    /**
     * the test is executed by a shell script which does the equivalent of the asserts
     */
    @Test
    public void executeTest() {

        sonarqubeStarter.startSonarqube();
        compiler.executeProject(jfreeChart);

    }

    /**
     * the test is executed by a shell script which does the equivalent of the asserts
     */
    @Test
    public void compileAndScanJunit4() {
        sonarqubeStarter.startSonarqube();
        compiler.executeProject(junit);
    }
}
