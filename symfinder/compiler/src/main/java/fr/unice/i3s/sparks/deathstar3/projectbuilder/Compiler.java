/*
 *
 *  This file is part of symfinder.
 *
 *  symfinder is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  symfinder is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 *  Copyright 2018-2021 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 *  Copyright 2018-2021 Xhevahire Tërnava <t.xheva@gmail.com>
 *  Copyright 2018-2021 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 *
 */

package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.model.AccessMode;
import com.github.dockerjava.api.model.Bind;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.api.model.Volume;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.models.SonarQubeToken;
import fr.unice.i3s.sparks.deathstar3.utils.LogContainerTestCallback;
import fr.unice.i3s.sparks.deathstar3.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Slf4j
public class Compiler {

    private final Utils utils = new Utils();
    private final DockerClient dockerClient;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Logger logger = LogManager.getLogger(Symfinder.class);

    public Compiler() {

        DockerClientConfig standard = DefaultDockerClientConfig.createDefaultConfigBuilder().build();
        DockerHttpClient httpClient = new ApacheDockerHttpClient.Builder().dockerHost(standard.getDockerHost())
                .sslConfig(standard.getSSLConfig()).maxConnections(100).connectionTimeout(Duration.ofSeconds(30))
                .responseTimeout(Duration.ofSeconds(45)).build();
        this.dockerClient = DockerClientBuilder.getInstance().withDockerHttpClient(httpClient).build();
    }

    /**
     * Compile and Scan a Java project to generate the metrics of SonarQube
     *
     * @param projectConfig
     * @return true if it was successful false if there was an error at some level
     */
    public synchronized boolean executeProject(ExperimentConfig projectConfig) {
        log.trace("Cloning project...");
        projectConfig = projectConfig.cloneSelfExact();
        log.trace("Project cloned.");

        try {
            projectConfig.setPath(utils.translatePath(projectConfig.getPath()));
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        log.trace("Cleaning old containers...");
        utils.removeOldExitedContainer(Constants.COMPILER_SCANNER_NAME);
        utils.removeOldExitedContainer(Constants.COMPILER_NAME);
        utils.removeOldExitedContainer(Constants.SCANNER_NAME);

        if (projectConfig.isBuildCmdIncludeSonar()) {
            try {
                var compileAndScanProjectId = this.compileAndScanProject(projectConfig);
                InspectContainerResponse.ContainerState containerState = waitForContainerCorrectExit(
                        compileAndScanProjectId);
                if (containerState.getExitCodeLong() != 0) {
//                    log.error(containerState.getError());
                    return false;
                }

            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        } else {
            var compileProjectId = compileProject(projectConfig);

            InspectContainerResponse.ContainerState containerState = waitForContainerCorrectExit(compileProjectId);
            if (containerState.getExitCodeLong() != 0) {
                return false;
            }

            try {
                String tokenName = RandomStringUtils.randomAlphabetic(8, 10).toUpperCase(Locale.ENGLISH);
                SonarQubeToken result = this.getToken(tokenName, Constants.SONARQUBE_LOCAL_URL);
                String scannerContainerId = this.runSonarScannerCli(projectConfig, result);
                InspectContainerResponse.ContainerState scannerContainerState = waitForContainerCorrectExit(
                        scannerContainerId);
                if (scannerContainerState.getExitCodeLong() != 0) {
                    return false;
                }
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }

        }

        return true;

    }

    private InspectContainerResponse.ContainerState waitForContainerCorrectExit(String containerId) {
        InspectContainerResponse container = dockerClient.inspectContainerCmd(containerId).exec();
        LogContainerTestCallback logCallback = new LogContainerTestCallback();
        dockerClient.logContainerCmd(containerId)
                .withStdErr(true)
                .withStdOut(true)
                .withFollowStream(true)
                .withTailAll()
                .exec(logCallback);
        while (!container.getState().getStatus().strip().equals("exited")) {
            log.trace(container.getState().toString());
            log.trace(containerId + " : " + container.getState().getStatus());
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            container = dockerClient.inspectContainerCmd(containerId).exec();
        }

        if (container.getState().getExitCodeLong() != 0) {
            log.error("Container exited with non-zero code");
            log.error(container.getLogPath());
            log.error(logCallback.toString());
            return container.getState();
        }

        log.info("Container exit with code zero " + containerId + " " + container.getState());
        return container.getState();
    }

    /**
     * Compile and scan the project in the same step
     *
     * @param projectConfig the Experiment Configuration
     * @return the containerId
     */
    String compileAndScanProject(ExperimentConfig projectConfig) throws JsonProcessingException {
        log.trace(String.format("Pulling build image %s:%s...", projectConfig.getBuildEnv(), projectConfig.getBuildEnvTag()));
        if (!utils.checkIfImageExists(projectConfig.getBuildEnv(), projectConfig.getBuildEnvTag())) {
            try {
                utils.downloadImage(projectConfig.getBuildEnv(), projectConfig.getBuildEnvTag());
            } catch (InterruptedException exception) {
                log.error("Cannot pull image necessary to compile project");
                return "";
            }

        }
        log.trace("Build image pulled.");
        String tokenName = RandomStringUtils.randomAlphabetic(8, 10).toUpperCase(Locale.ENGLISH);
        SonarQubeToken result = this.getToken(tokenName, Constants.SONARQUBE_LOCAL_URL);
        Volume volume = new Volume("/project");

        var command = dockerClient
                .createContainerCmd(projectConfig.getBuildEnv() + ":" + projectConfig.getBuildEnvTag())// .withUser(utils.getUserIdentity())
                .withName(Constants.COMPILER_SCANNER_NAME);
        if (projectConfig.getBuildEnv().equals("maven")) { // to use sonar in maven jdk version need to be greater or
            // equals to 11

            // List.of() result is not mutable so we transform it in mutable through new
            // ArrayList<>()
            List<String> mvnCommmands = new ArrayList<>(List.of(projectConfig.getBuildCmd().strip().split("\\s+")));
            mvnCommmands.add(1, "--no-transfer-progress");
            mvnCommmands.add("-Dsonar.login=" + result.token());
            mvnCommmands.add("-Dsonar.host.url=" + Constants.SONARQUBE_DOCKER_URL);
            mvnCommmands.add("-Dsonar.projectKey=" + projectConfig.getProjectName());
            mvnCommmands.add("-Dsonar.projectName=" + projectConfig.getProjectName());
            mvnCommmands.add("-Dmaven.test.failure.ignore=true");
            command = command.withEntrypoint(mvnCommmands);
        }

        var container = command.withHostConfig(HostConfig.newHostConfig()
                        .withBinds(new Bind(projectConfig.getPath(), volume, AccessMode.rw))
                        .withNetworkMode(Constants.NETWORK_NAME))
                .exec();

        String containerId = container.getId();
        dockerClient.startContainerCmd(containerId).exec();
        log.trace("Starting build container...");
        return containerId;

    }

    String compileProject(ExperimentConfig projectConfig) {
        log.trace("Compiling project...");
        if (!this.utils.checkIfImageExists(projectConfig.getBuildEnv(), projectConfig.getBuildEnvTag())) {
            try {
                utils.downloadImage(projectConfig.getBuildEnv(), projectConfig.getBuildEnvTag());
            } catch (InterruptedException exception) {
                Compiler.log.warn("Cannot pull image necessary to compile project");
            }

        }

        Volume volume = new Volume("/project");
        List<String> commmands = new ArrayList<>(List.of(projectConfig.getBuildCmd().strip().split("\\s+")));
        CreateContainerResponse container = dockerClient
                .createContainerCmd(projectConfig.getBuildEnv() + ":" + projectConfig.getBuildEnvTag())// .withUser(utils.getUserIdentity())
                .withName(Constants.COMPILER_NAME)
                .withHostConfig(
                        HostConfig.newHostConfig().withBinds(new Bind(projectConfig.getPath(), volume, AccessMode.rw)))
                .withEntrypoint(commmands).exec();

        dockerClient.startContainerCmd(container.getId()).exec();

        return container.getId();

    }

    private HttpHeaders createHeaders(String username, String password) {
        return new HttpHeaders() {
            {
                String auth = username + ":" + password;
                byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(StandardCharsets.US_ASCII));
                String authHeader = "Basic " + new String(encodedAuth);
                set("Authorization", authHeader);
            }
        };
    }

    /**
     * https://www.baeldung.com/how-to-use-resttemplate-with-basic-authentication-in-spring
     *
     * @param token_name
     * @return
     * @throws JsonProcessingException
     */
    SonarQubeToken getToken(String token_name, String sonarqubeUrl) throws JsonProcessingException {
        // curl -u admin:admin -X POST
        // http://localhost:9000/api/user_tokens/generate?name=mytoken

        var response = restTemplate.exchange(sonarqubeUrl + "/api/user_tokens/generate?name=" + token_name,
                HttpMethod.POST, new HttpEntity<>(createHeaders("admin", "admin")), String.class);

        return this.objectMapper.readValue(response.getBody(), SonarQubeToken.class);
    }

    String runSonarScannerCli(ExperimentConfig projectConfig, SonarQubeToken token) {

        if (!utils.checkIfImageExists(Constants.SONAR_SCANNER_IMAGE, Constants.SONAR_SCANNER_IMAGE_TAG)) {
            try {
                utils.downloadImage(Constants.SONAR_SCANNER_IMAGE, Constants.SONAR_SCANNER_IMAGE_TAG);
            } catch (InterruptedException exception) {
                log.error("Cannot pull image necessary to Scan project");
                return "";
            }

        }

        Volume volume = new Volume("/usr/src");
        String completePath = "";
        if (projectConfig.getSourcePackage() == null || projectConfig.getSourcePackage().isBlank()
                || projectConfig.getSourcePackage().strip().equals(".")) {
            completePath = projectConfig.getPath();
        } else {
            completePath = Paths.get(projectConfig.getPath(), projectConfig.getSourcePackage()).toString();
        }

        CreateContainerResponse container = dockerClient
                .createContainerCmd(Constants.SONAR_SCANNER_IMAGE + ":" + Constants.SONAR_SCANNER_IMAGE_TAG)
                // .withUser(utils.getUserIdentity())
                .withName(Constants.SCANNER_NAME).withEnv("SONAR_LOGIN=" + token.token())
                .withHostConfig(HostConfig.newHostConfig().withBinds(new Bind(completePath, volume, AccessMode.rw))
                        .withNetworkMode(Constants.NETWORK_NAME))
                .withEnv("SONAR_HOST_URL=" + Constants.SONARQUBE_DOCKER_URL)
                .exec();

        dockerClient.startContainerCmd(container.getId()).exec();

        return container.getId();
    }

}
