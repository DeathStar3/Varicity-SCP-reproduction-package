package fr.varicity.projectbuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.CreateNetworkResponse;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.command.PullImageResultCallback;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.DockerClientBuilder;

import fr.varicity.exceptions.PullException;
import fr.varicity.models.ProjectConfig;
import fr.varicity.models.SonarQubeToken;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;


import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

public class Compiler {

    private final DockerClient dockerClient = DockerClientBuilder.getInstance().build();

    private final RestTemplate restTemplate =  new RestTemplate();
    private final ObjectMapper objectMapper=new ObjectMapper();
    private final Logger logger=Logger.getLogger(Compiler.class.getName());

    private static final String NETWORK_NAME ="varicity-config";

    public Compiler(){

    }


    private void waitForContainerCorrectExit(String containerId){
        InspectContainerResponse container
                = dockerClient.inspectContainerCmd(containerId).exec();

        while (!container.getState().getStatus().strip().equals("exited")){
            logger.info(container.getState().toString());
            logger.info(containerId+" : "+ container.getState().getStatus());
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            container
                    = dockerClient.inspectContainerCmd(containerId).exec();
        }

        if(container.getState().getExitCodeLong()!=0){
            logger.severe("Container exited with non-zero code");
        }

        logger.info("End waiting for "+containerId+" "+container.getState());
    }

    public void executeProject(ProjectConfig projectConfig){
       var compileProjectId= compileProject(projectConfig);

        waitForContainerCorrectExit(compileProjectId);


        try {
            String tokenName = RandomStringUtils.randomAlphabetic(8,10).toUpperCase(Locale.ENGLISH);
            SonarQubeToken  result = this.getToken(tokenName, "http://localhost:9000");
           String scannerContainerId= this.runSonarScannerCli(projectConfig,result);
           waitForContainerCorrectExit(scannerContainerId);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }



    }

    public String compileProject(ProjectConfig projectConfig){

    if(!checkIfImageExists(projectConfig.buildEnv(), projectConfig.tag())){
        try {
            downloadImage(projectConfig.buildEnv(), projectConfig.tag());
        }catch (PullException exception){
        this.logger.severe("Cannot pull image necessary to compile project");
            System.exit(1);
        }

    }



        Volume volume = new Volume("/project");
        CreateContainerResponse container = dockerClient.createContainerCmd(projectConfig.buildEnv()+":"+projectConfig.tag())
                        .withHostConfig(HostConfig.newHostConfig().withBinds(new Bind(projectConfig.path(), volume, AccessMode.rw)  ))
        .withEntrypoint(projectConfig.buildCmds() ). exec();//TODO assuming the project is a mvn project

       dockerClient.startContainerCmd(container.getId()) .exec();

       return container.getId();
                
    }

    private boolean checkIfImageExists(String image, String tag){
        return dockerClient.listImagesCmd().exec().stream().anyMatch(img -> Arrays.stream(img.getRepoTags()).anyMatch(name -> name.equals(image+":"+tag)));
    }

    private void downloadImage(String image, String tag) throws PullException{
        try {
            dockerClient.pullImageCmd(image)
                    .withTag(tag)
                    .exec(new PullImageResultCallback())
                    .awaitCompletion(5, TimeUnit.MINUTES);
        } catch (InterruptedException e) {
            throw new PullException();
        }
    }


    public void startSonarqube(){
        CreateContainerResponse container = dockerClient.createContainerCmd("varicity-sonarqube").withName("sonarqubehost")
                .withExposedPorts(ExposedPort.parse("9000")).withHostConfig(
                HostConfig.newHostConfig().withPortBindings(PortBinding.parse("9000:9000")).withNetworkMode(NETWORK_NAME)
        ).exec();

        dockerClient.startContainerCmd(container.getId()) .exec();
    }

    private HttpHeaders createHeaders(String username, String password){
        return new HttpHeaders() {{
            String auth = username + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(
                    auth.getBytes(StandardCharsets.US_ASCII) );
            String authHeader = "Basic " + new String( encodedAuth );
            set( "Authorization", authHeader );
        }};
    }

    /**
     * https://www.baeldung.com/how-to-use-resttemplate-with-basic-authentication-in-spring
     * @param token_name
     * @return
     * @throws JsonProcessingException
     */
    public SonarQubeToken getToken(String token_name, String sonarqubeUrl) throws JsonProcessingException {
        //curl -u admin:admin -X POST http://localhost:9000/api/user_tokens/generate?name=mytoken

                var response=restTemplate.exchange
                (sonarqubeUrl+"/api/user_tokens/generate?name="+token_name, HttpMethod.POST, new HttpEntity<>(createHeaders("admin", "admin")), String.class);


        return this.objectMapper.readValue(response.getBody(), SonarQubeToken.class) ;
    }

    public String runSonarScannerCli(ProjectConfig projectConfig, SonarQubeToken token){


        List<Network> networks = dockerClient.listNetworksCmd().withNameFilter(NETWORK_NAME).exec();
        if (networks.isEmpty()) {
            CreateNetworkResponse networkResponse = dockerClient
                    .createNetworkCmd()
                    .withName(NETWORK_NAME)
                    .withAttachable(true)
                    .withDriver("bridge").exec();
            System.out.printf("Network %s created...\n", networkResponse.getId());
        }


        Volume volume = new Volume("/usr/src");
        String completePath="";
        if(projectConfig.sourceRoot().isBlank()){
            completePath=projectConfig.path();
        }
        else{
            completePath=projectConfig.path()+"/"+projectConfig.sourceRoot();
        }



        CreateContainerResponse container = dockerClient.createContainerCmd("sonarsource/sonar-scanner-cli").withEnv("SONAR_LOGIN="+token.token())
                .withHostConfig(
                        HostConfig.newHostConfig().withBinds(new Bind(completePath, volume, AccessMode.rw))
                                .withNetworkMode(NETWORK_NAME)
                )


                .withEnv("SONAR_HOST_URL="+projectConfig.sonarqubeUrl()).exec();

        dockerClient.startContainerCmd(container.getId()) .exec();

        return container.getId();
    }
}
