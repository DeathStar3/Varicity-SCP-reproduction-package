package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.exception.NotFoundException;
import com.github.dockerjava.api.exception.NotModifiedException;
import com.github.dockerjava.core.DockerClientBuilder;
import fr.unice.i3s.sparks.deathstar3.models.SonarQubeStatus;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

public class SonarQubeStarterTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DockerClient dockerClient = DockerClientBuilder.getInstance().build();
    private final RestTemplate restTemplate = new RestTemplate();
    private SonarQubeStarter sonarqubeStarter = new SonarQubeStarter();

    @BeforeEach
    public void setUp() {

        try {
            dockerClient.stopContainerCmd("sonarqubehost").exec();
            dockerClient.removeContainerCmd("sonarqubehost").exec();
        } catch (NotModifiedException | NotFoundException exception) {
            ;
        }

    }

    @Test
    public void startSonarqubeTest() {

        this.sonarqubeStarter.startSonarqube();

        Assertions.assertDoesNotThrow(() -> {
            var sonarqubeStatusResponse = this.restTemplate.getForEntity("http://localhost:9000/api/system/status",
                    String.class);
            var sonarqubeStatus = this.objectMapper.readValue(sonarqubeStatusResponse.getBody(), SonarQubeStatus.class);
            Assertions.assertEquals("UP", sonarqubeStatus.status());
        });

    }

    @AfterEach
    public void tearDown() {
        try {
            dockerClient.stopContainerCmd("sonarqubehost").exec();
            dockerClient.removeContainerCmd("sonarqubehost").exec();
        } catch (NotModifiedException | NotFoundException exception) {
            ;
        }
    }
}
