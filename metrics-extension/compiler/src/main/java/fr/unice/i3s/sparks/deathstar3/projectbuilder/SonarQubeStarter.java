package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.BuildImageResultCallback;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.CreateNetworkResponse;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.api.model.Network;
import com.github.dockerjava.api.model.PortBinding;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import fr.unice.i3s.sparks.deathstar3.models.SonarQubeStatus;
import fr.unice.i3s.sparks.deathstar3.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.List;
import java.util.Set;

import static fr.unice.i3s.sparks.deathstar3.projectbuilder.Compiler.NETWORK_NAME;

@Slf4j
public class SonarQubeStarter {

    public static final String SONARQUBE_CONTAINER_NAME = "sonarqubehost";
    private static final Utils utils = new Utils();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DockerClient dockerClient;
    private final RestTemplate restTemplate = new RestTemplate();



    public SonarQubeStarter() {


        DockerClientConfig standard = DefaultDockerClientConfig.createDefaultConfigBuilder().build();
        ApacheDockerHttpClient httpClient = new ApacheDockerHttpClient.Builder()
                .dockerHost(standard.getDockerHost())
                .sslConfig(standard.getSSLConfig())
                .maxConnections(100)
                .connectionTimeout(Duration.ofSeconds(30))
                .responseTimeout(Duration.ofSeconds(45))
                .build();
        dockerClient = DockerClientBuilder.getInstance().withDockerHttpClient(httpClient).build();
    }

    private boolean checkIfSonarqubeHasExited(String containerId) {
        InspectContainerResponse container = dockerClient.inspectContainerCmd(containerId).exec();
        log.info(container.getState().toString());
        log.info(containerId + " : " + container.getState().getStatus());
        return container.getState().getStatus().strip().equals("exited");
    }

    public boolean startSonarqube() {

        // TODO check if varicity-sonarqube is already running or existing ...
        utils.removeOldExitedContainer(SONARQUBE_CONTAINER_NAME);
        if (existingSonarqube()) {
            return true;
        }

        prepareVaricitySonarqube();

        createNetwork();

        CreateContainerResponse container = dockerClient.createContainerCmd("varicity-sonarqube")
                .withName(SONARQUBE_CONTAINER_NAME).withExposedPorts(ExposedPort.parse("9000"))
                .withHostConfig(HostConfig.newHostConfig().withPortBindings(PortBinding.parse("9000:9000"))
                        .withNetworkMode(NETWORK_NAME))
                .exec();

        dockerClient.startContainerCmd(container.getId()).exec();

        while (true) {
            try {

                if (checkIfSonarqubeHasExited(container.getId())) {
                    return false;
                }

                var sonarqubeStatusResponse = this.restTemplate.getForEntity("http://localhost:9000/api/system/status",
                        String.class);
                var sonarqubeStatus = this.objectMapper.readValue(sonarqubeStatusResponse.getBody(),
                        SonarQubeStatus.class);
                if (sonarqubeStatus.status().equals("UP")) {
                    break;
                }

            } catch (Exception e) {
                log.info("Sonarqube is not ready yet " + e.getClass().getName());
            }
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }
        return true;
    }

    private void createNetwork() {
        List<Network> networks = dockerClient.listNetworksCmd().withNameFilter(NETWORK_NAME).exec();
        if (networks.isEmpty()) {
            CreateNetworkResponse networkResponse = dockerClient.createNetworkCmd().withName(NETWORK_NAME)
                    .withAttachable(true).withDriver("bridge").exec();
            log.info(String.format("Network %s created...\n", networkResponse.getId()));
        }
    }

    private void sonarqubeStartingWaitForSonarqubeUp() {
        while (true) {
            try {
                var sonarqubeStatusResponse = this.restTemplate.getForEntity("http://localhost:9000/api/system/status",
                        String.class);
                var sonarqubeStatus = this.objectMapper.readValue(sonarqubeStatusResponse.getBody(),
                        SonarQubeStatus.class);
                if (sonarqubeStatus.status().equals("UP")) {
                    return;
                }

            } catch (ResourceAccessException e) {
                log.info("Sonarqube has exited or was not UP " + e);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
    }

    private boolean existingSonarqube() {
        try {
            var sonarqubeStatusResponse = this.restTemplate.getForEntity("http://localhost:9000/api/system/status",
                    String.class);
            var sonarqubeStatus = this.objectMapper.readValue(sonarqubeStatusResponse.getBody(),
                    SonarQubeStatus.class);
            if (sonarqubeStatus.status().equals("UP")) {
                return true;
            } else if (sonarqubeStatus.status().equals("STARTING")) {
                sonarqubeStartingWaitForSonarqubeUp();
                return true;
            }

        } catch (ResourceAccessException exception) {
            log.info("No instance of sonarqube was running");
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return false;
    }

    private void prepareVaricitySonarqube() {

        if (utils.checkIfImageExists("varicity-sonarqube", "latest")) {
            return;
        }

        try {
            Path dir = Files.createTempDirectory("sonarqube-docker-varicity");
            Path dockerFilePath = Files.createTempFile(dir, "sonarqube-varicity", ".dockerfile");

            Files.copy(SonarQubeStarter.class.getClassLoader().getResourceAsStream("varicity-sonarqube.dockerfile"),
                    dockerFilePath, StandardCopyOption.REPLACE_EXISTING);
            String imageId = dockerClient.buildImageCmd()
                    .withDockerfile(dockerFilePath.toFile())
                    .withPull(true).withNoCache(true).withTags(Set.of("varicity-sonarqube:latest"))
                    .exec(new BuildImageResultCallback()).awaitImageId();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

}
