package fr.varicity.builders;

import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DockerClientBuilder;

import fr.varicity.exceptions.PullException;
import org.junit.Test;

import fr.varicity.models.ProjectConfig;
import fr.varicity.projectbuilder.Compiler;

import static org.junit.Assert.assertNotNull;

public class CompilerTest {

    private final DockerClient dockerClient = DockerClientBuilder.getInstance().build();

    private Compiler compiler = new Compiler();
    ProjectConfig project=  new ProjectConfig("CookieFactory", "http:/zdefe",
            "/home/anagonou/Documents/si5/ter/4A_ISA_TheCookieFactory", "j2e/", new ProjectConfig.SonarCloud(false, ""),
            "maven","3.8-openjdk-8", List.of("mvn", "clean", "package", "-f", "/project/j2e/pom.xml"), "http://sonarqubehost:9000");


    ProjectConfig jfreeChart=new ProjectConfig("jfreechart","https://github.com/jfree/jfreechart", "/home/anagonou/Documents/si5/ter/jfreechart",
            "", new ProjectConfig.SonarCloud(false, ""), "maven", "3.8.2-jdk-11", List.of("mvn", "clean", "install", "-f", "/project/pom.xml"), "http://sonarqubehost:9000");

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
