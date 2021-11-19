package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DockerClientBuilder;


import fr.unice.i3s.sparks.deathstar3.exceptions.PullException;
import fr.unice.i3s.sparks.deathstar3.model.Config;
import org.junit.Test;

import static org.junit.Assert.assertNotNull;

public class CompilerTest {

    private final DockerClient dockerClient = DockerClientBuilder.getInstance().build();

    private Compiler compiler = new Compiler();
    Config project=  new Config("CookieFactory",
            "/tmp/varicity-xp-projets/4A_ISA_TheCookieFactory", "j2e/",
            "maven","3.8-openjdk-8", List.of("mvn", "clean", "package", "-f", "/project/j2e/pom.xml"), "http://sonarqubehost:9000", false);


    Config jfreeChart=new Config("jfreechart", "/tmp/varicity-xp-projets/jfreechart",
            "", "maven", "3.8.2-jdk-11", List.of("mvn", "clean", "install","sonar:sonar" ,"-f", "/project/pom.xml"), "http://sonarqubehost:9000", true);

    @Test
    public void compileProjectTest() throws PullException {
        compiler.compileProject(project);
    }

    @Test
    public void getTokenTest() throws JsonProcessingException {
        var result=compiler.getToken("my_vezdzhdgreatest_name", "http://localhost:9000");
        System.out.println(result);
        assertNotNull(result);

    }

    @Test
    public void runSonarScannerCliTest() throws JsonProcessingException{
        var result=compiler.getToken("some_random_tokendeffd", "http://localhost:9000");
        compiler.runSonarScannerCli(project,result);
    }


    @Test
    public void listImagesTest(){
      dockerClient.listImagesCmd().exec().forEach(image -> System.out.println(Arrays.toString(image.getRepoTags())));

    }

    @Test
    public void executeTest(){

        compiler.executeProject(jfreeChart);
    }
}
