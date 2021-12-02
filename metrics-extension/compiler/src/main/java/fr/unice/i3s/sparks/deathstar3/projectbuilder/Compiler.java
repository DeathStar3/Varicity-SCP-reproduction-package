package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.command.PullImageResultCallback;
import com.github.dockerjava.api.command.WaitContainerResultCallback;
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
import fr.unice.i3s.sparks.deathstar3.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

@Slf4j
public class Compiler {

    public static final String NETWORK_NAME = "varicity-config";
    public static final String COMPILER_SCANNER_NAME = "varicity-compiler-scanner-container";
    public static final String COMPILER_NAME = "varicity-compiler-container";
    public static final String SCANNER_NAME = "varicity-scanner-container";
    private static final Utils utils = new Utils();
    public static final String SONARQUBE_LOCAL_URL = "http://localhost:9000";
    private static final String SONARQUBE_DOCKER_URL = "http://sonarqubehost:9000";
    private static final String SONAR_SCANNER_IMAGE = "sonarsource/sonar-scanner-cli";
    private static final String SONAR_SCANNER_IMAGE_TAG = "4";
    private final DockerClient dockerClient;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Compiler() {

        DockerClientConfig standard = DefaultDockerClientConfig.createDefaultConfigBuilder().build();
        DockerHttpClient httpClient = new ApacheDockerHttpClient.Builder().dockerHost(standard.getDockerHost())
                .sslConfig(standard.getSSLConfig()).maxConnections(100).connectionTimeout(Duration.ofSeconds(30))
                .responseTimeout(Duration.ofSeconds(45)).build();
        this.dockerClient = DockerClientBuilder.getInstance().withDockerHttpClient(httpClient).build();
    }

    public boolean executeProject(ExperimentConfig projectConfig) {

        utils.removeOldExitedContainer(COMPILER_SCANNER_NAME);
        utils.removeOldExitedContainer(COMPILER_NAME);
        utils.removeOldExitedContainer(SCANNER_NAME);


        if (projectConfig.isBuildCmdIncludeSonar()) {
            try {
                var compileAndScanProjectId = this.compileAndScanProject(projectConfig);
                InspectContainerResponse.ContainerState containerState= waitForContainerCorrectExit(compileAndScanProjectId);
                if(containerState.getExitCodeLong()!=0){
                    return false;
                }

            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        } else {
            var compileProjectId = compileProject(projectConfig);

            InspectContainerResponse.ContainerState containerState = waitForContainerCorrectExit(compileProjectId);
            if(containerState.getExitCodeLong() != 0){
                return false;
            }

            try {
                String tokenName = RandomStringUtils.randomAlphabetic(8, 10).toUpperCase(Locale.ENGLISH);
                SonarQubeToken result = this.getToken(tokenName, SONARQUBE_LOCAL_URL);
                String scannerContainerId = this.runSonarScannerCli(projectConfig, result);
                InspectContainerResponse.ContainerState scannerContainerState = waitForContainerCorrectExit(scannerContainerId);
                if(scannerContainerState.getExitCodeLong() != 0){
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


        while (!container.getState().getStatus().strip().equals("exited")) {
            log.info(container.getState().toString());
            log.info(containerId + " : " + container.getState().getStatus());
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            container = dockerClient.inspectContainerCmd(containerId).exec();

        }

        if (container.getState().getExitCodeLong() != 0) {
            log.error("Container exited with non-zero code");
            return container.getState();
        }

        log.info("Container exit with code zero " + containerId + " " + container.getState());
        return container.getState();
    }

    /**
     * Compile and scan the project in the same step if
     *
     * @param projectConfig
     * @return the containerId
     */
    public String compileAndScanProject(ExperimentConfig projectConfig) throws JsonProcessingException {
        if (!utils.checkIfImageExists(projectConfig.getBuildEnv(), projectConfig.getBuildEnvTag())) {
            try {
                downloadImage(projectConfig.getBuildEnv(), projectConfig.getBuildEnvTag());
            } catch (InterruptedException exception) {
                log.error("Cannot pull image necessary to compile project");
                return "";
            }

        }

        String tokenName = RandomStringUtils.randomAlphabetic(8, 10).toUpperCase(Locale.ENGLISH);
        SonarQubeToken result = this.getToken(tokenName, SONARQUBE_LOCAL_URL);
        Volume volume = new Volume("/project");

        var command = dockerClient
                .createContainerCmd(projectConfig.getBuildEnv() + ":" + projectConfig.getBuildEnvTag())//.withUser(utils.getUserIdentity())
                .withName(COMPILER_SCANNER_NAME);
        if (projectConfig.getBuildEnv().equals("maven")) { // to use sonar in maven jdk version need to be greater or
            // equals to 11

            //List.of() result is not mutable so we transform it in mutable through new ArrayList<>()
            List<String> mvnCommmands = new ArrayList<>(List.of(projectConfig.getBuildCmd().strip().split("\\s+")));
            mvnCommmands.add("-Dsonar.login=" + result.token());
            mvnCommmands.add("-Dsonar.host.url=" + SONARQUBE_DOCKER_URL);
            mvnCommmands.add("-Dsonar.projectKey=" + projectConfig.getProjectName());
            command = command.withEntrypoint(mvnCommmands);
        }

        var container = command.withHostConfig(HostConfig.newHostConfig()
                        .withBinds(new Bind(projectConfig.getPath(), volume, AccessMode.rw)).withNetworkMode(NETWORK_NAME))
                .exec();

        dockerClient.startContainerCmd(container.getId()).exec();

        return container.getId();

    }

    public String compileProject(ExperimentConfig projectConfig) {

        if (!this.utils.checkIfImageExists(projectConfig.getBuildEnv(), projectConfig.getBuildEnvTag())) {
            try {
                downloadImage(projectConfig.getBuildEnv(), projectConfig.getBuildEnvTag());
            } catch (InterruptedException exception) {
                this.log.warn("Cannot pull image necessary to compile project");

            }

        }

        Volume volume = new Volume("/project");
        List<String> commmands = new ArrayList<>(List.of(projectConfig.getBuildCmd().strip().split("\\s+")));
        CreateContainerResponse container = dockerClient
                .createContainerCmd(projectConfig.getBuildEnv() + ":" + projectConfig.getBuildEnvTag())//.withUser(utils.getUserIdentity())
                .withName(COMPILER_NAME)
                .withHostConfig(HostConfig.newHostConfig().withBinds(new Bind(projectConfig.getPath(), volume, AccessMode.rw)))
                .withEntrypoint(commmands).exec();

        dockerClient.startContainerCmd(container.getId()).exec();

        return container.getId();

    }


    private void downloadImage(String image, String tag) throws InterruptedException {

        dockerClient.pullImageCmd(image).withTag(tag).exec(new PullImageResultCallback()).awaitCompletion(7,
                TimeUnit.MINUTES);
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
    public SonarQubeToken getToken(String token_name, String sonarqubeUrl) throws JsonProcessingException {
        // curl -u admin:admin -X POST
        // http://localhost:9000/api/user_tokens/generate?name=mytoken

        var response = restTemplate.exchange(sonarqubeUrl + "/api/user_tokens/generate?name=" + token_name,
                HttpMethod.POST, new HttpEntity<>(createHeaders("admin", "admin")), String.class);

        return this.objectMapper.readValue(response.getBody(), SonarQubeToken.class);
    }

    public String runSonarScannerCli(ExperimentConfig projectConfig, SonarQubeToken token) {

        if (!utils.checkIfImageExists(SONAR_SCANNER_IMAGE, SONAR_SCANNER_IMAGE_TAG)) {
            try {
                downloadImage(SONAR_SCANNER_IMAGE, SONAR_SCANNER_IMAGE_TAG);
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
            completePath = projectConfig.getPath() + "/" + projectConfig.getSourcePackage();
        }

        CreateContainerResponse container = dockerClient.createContainerCmd(SONAR_SCANNER_IMAGE + ":" + SONAR_SCANNER_IMAGE_TAG)
                //.withUser(utils.getUserIdentity())
                .withName(SCANNER_NAME).withEnv("SONAR_LOGIN=" + token.token())
                .withHostConfig(HostConfig.newHostConfig().withBinds(new Bind(completePath, volume, AccessMode.rw))
                        .withNetworkMode(NETWORK_NAME))
                .withEnv("SONAR_HOST_URL=" + SONARQUBE_DOCKER_URL).exec();

        dockerClient.startContainerCmd(container.getId()).exec();

        return container.getId();
    }

}
