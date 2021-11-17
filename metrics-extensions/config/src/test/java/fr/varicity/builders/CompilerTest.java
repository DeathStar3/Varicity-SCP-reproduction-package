package fr.varicity.builders;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DockerClientBuilder;

import org.junit.Test;

import fr.varicity.models.ProjectConfig;
import fr.varicity.projectbuilder.Compiler;

import static org.junit.Assert.assertNotNull;

public class CompilerTest {



    private Compiler compiler = new Compiler();
    ProjectConfig project=  new ProjectConfig("CookieFactory", "http:/zdefe",
            "/home/anagonou/Documents/si5/ter/4A_ISA_TheCookieFactory", "j2e/", new ProjectConfig.SonarCloud(false, ""),
            "maven:3.8-openjdk-8", List.of(""), "http://sonarqubehost:9000");

    @Test
    public void compileProjectTest(){




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
}
