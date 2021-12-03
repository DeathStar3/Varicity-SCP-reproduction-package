package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.api.model.PortBinding;
import com.github.dockerjava.api.model.Ports;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import fr.unice.i3s.sparks.deathstar3.engine.configuration.Neo4jParameters;
import fr.unice.i3s.sparks.deathstar3.utils.Utils;
import fr.unice.i3s.sparks.deathstar3.utils.WaitFor;
import lombok.extern.slf4j.Slf4j;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Slf4j
public class Neo4JStarter {
    private final DockerClient dockerClient;

    private final Utils utils=new Utils();

    public Neo4JStarter() {
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

    public synchronized Neo4jParameters startNeo4J(){

        if (!utils.checkIfImageExists(Constants.SYMFINDER_NEO4J_IMAGE,   Constants.SYMFINDER_NEO4J_TAG )) {
            try {
                utils.downloadImage(Constants.SYMFINDER_NEO4J_IMAGE, Constants.SYMFINDER_NEO4J_IMAGE);
            } catch (InterruptedException exception) {
                log.error("Cannot neo4j image requested "+Constants.SYMFINDER_NEO4J_IMAGE +":" +  Constants.SYMFINDER_NEO4J_TAG );
                throw new RuntimeException(exception);
            }

        }

        utils.removeOldExitedContainer(Constants.NEO4J_CONTAINER_NAME);

        if(existingNeo4J()){
            System.out.println("An instance of neo4j seems to be already running");
            log.info("An instance of neo4j seems to be already running ");
            return new Neo4jParameters("bolt://"+ Constants.getNeo4jLocalHostname()+":7687","","");
        }



        // Create the container.
      CreateContainerResponse createContainerResponse=   dockerClient
                .createContainerCmd(Constants.SYMFINDER_NEO4J_IMAGE + ":" + Constants.SYMFINDER_NEO4J_TAG)
                .withName(Constants.NEO4J_CONTAINER_NAME)
                .withHostName(Constants.NEO4J_HOSTNAME)
                .withHostConfig(
                        HostConfig
                                .newHostConfig()
                                .withPortBindings(
                                        new PortBinding(
                                                new Ports.Binding("127.0.0.1", "7474"),
                                                new ExposedPort(7474)
                                        ),
                                        new PortBinding(
                                                new Ports.Binding("127.0.0.1", "7687"),
                                                new ExposedPort(7687)
                                        )
                                ).withNetworkMode(Constants.NETWORK_NAME)
                )
                .withEnv(List.of(
                        "NEO4J_AUTH=none"
                ))
                .exec();

        dockerClient.startContainerCmd(createContainerResponse.getId()).exec();

        System.out.println("Waiting for neo4j to be up");
        WaitFor.waitForPort(Constants.getNeo4jLocalHostname(), 7474,60_000);

        return new Neo4jParameters("bolt://"+ Constants.getNeo4jLocalHostname()+":7687","","");

    }

    private boolean existingNeo4J(){
        var containers = dockerClient.listContainersCmd()
                .withNameFilter(List.of(Constants.NEO4J_CONTAINER_NAME)).exec();
        return !containers.isEmpty();
    }

}
