package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.BuildImageResultCallback;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.CreateNetworkResponse;
import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.api.model.Network;
import com.github.dockerjava.api.model.PortBinding;
import com.github.dockerjava.core.DockerClientBuilder;
import fr.unice.i3s.sparks.deathstar3.models.SonarQubeStatus;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.web.client.RestTemplate;
import java.nio.file.StandardCopyOption;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.logging.Logger;

import static fr.unice.i3s.sparks.deathstar3.projectbuilder.Compiler.NETWORK_NAME;

public class SonarQubeStarter {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DockerClient dockerClient = DockerClientBuilder.getInstance().build();
    private final RestTemplate restTemplate = new RestTemplate();
    private final Logger logger = Logger.getLogger(SonarQubeStarter.class.getName());

    public void startSonarqube() {

        prepareVaricitySonarqube();

        createNetwork();

        CreateContainerResponse container = dockerClient.createContainerCmd("varicity-sonarqube")
                .withName("sonarqubehost").withExposedPorts(ExposedPort.parse("9000")).withHostConfig(HostConfig
                        .newHostConfig().withPortBindings(PortBinding.parse("9000:9000")).withNetworkMode(NETWORK_NAME))
                .exec();

        dockerClient.startContainerCmd(container.getId()).exec();

        while (true) {
            try {
                var sonarqubeStatusResponse = this.restTemplate.getForEntity("http://localhost:9000/api/system/status",
                        String.class);
                var sonarqubeStatus = this.objectMapper.readValue(sonarqubeStatusResponse.getBody(),
                        SonarQubeStatus.class);
                if (sonarqubeStatus.status().equals("UP")) {
                    break;
                }

            } catch (Exception e) {
                this.logger.info("Sonarqube is not ready yet " + e.getClass().getName());
            }
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }
    }

    private void createNetwork() {
        List<Network> networks = dockerClient.listNetworksCmd().withNameFilter(NETWORK_NAME).exec();
        if (networks.isEmpty()) {
            CreateNetworkResponse networkResponse = dockerClient.createNetworkCmd().withName(NETWORK_NAME)
                    .withAttachable(true).withDriver("bridge").exec();
            logger.info(String.format("Network %s created...\n", networkResponse.getId()));
        }
    }

    private void prepareVaricitySonarqube() {

        if (checkIfImageExists("varicity-sonarqube", "latest")) {
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

    private boolean checkIfImageExists(String image, String tag) {
        return dockerClient.listImagesCmd().exec().stream()
                .anyMatch(img -> Arrays.stream(img.getRepoTags()).anyMatch(name -> name.equals(image + ":" + tag)));
    }

}
