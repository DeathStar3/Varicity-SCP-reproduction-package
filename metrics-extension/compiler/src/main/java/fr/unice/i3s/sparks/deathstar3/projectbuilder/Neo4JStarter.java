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

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.api.model.PortBinding;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration.Neo4jParameters;
import fr.unice.i3s.sparks.deathstar3.utils.Utils;
import fr.unice.i3s.sparks.deathstar3.utils.WaitFor;
import lombok.extern.slf4j.Slf4j;

import java.time.Duration;
import java.util.List;

@Slf4j
public class Neo4JStarter {
    private final DockerClient dockerClient;

    private final Utils utils = new Utils();

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

    public synchronized Neo4jParameters startNeo4J() {

        utils.createNetwork();

        if (!utils.checkIfImageExists(Constants.SYMFINDER_NEO4J_IMAGE, Constants.SYMFINDER_NEO4J_TAG)) {
            log.info("{}:{} does not exist in local", Constants.SYMFINDER_NEO4J_IMAGE, Constants.SYMFINDER_NEO4J_TAG);
            try {
                log.info("Attempting to download {}:{}", Constants.SYMFINDER_NEO4J_IMAGE, Constants.SYMFINDER_NEO4J_TAG);
                utils.downloadImage(Constants.SYMFINDER_NEO4J_IMAGE, Constants.SYMFINDER_NEO4J_TAG);
            } catch (InterruptedException exception) {
                log.error("Cannot download neo4j image requested {}:{}", Constants.SYMFINDER_NEO4J_IMAGE, Constants.SYMFINDER_NEO4J_TAG);
                throw new RuntimeException(exception);
            }

        }

        utils.removeOldExitedContainer(Constants.NEO4J_CONTAINER_NAME);

        if (existingNeo4J()) {
            log.info("An instance of neo4j seems to be already running ");
            return new Neo4jParameters("bolt://" + Constants.getNeo4jLocalHostname() + ":7687", "", "");
        }

        // Create the container.
        CreateContainerResponse createContainerResponse = dockerClient
                .createContainerCmd(Constants.SYMFINDER_NEO4J_IMAGE + ":" + Constants.SYMFINDER_NEO4J_TAG)
                .withName(Constants.NEO4J_CONTAINER_NAME)
                .withHostName(Constants.NEO4J_HOSTNAME)
                .withExposedPorts(ExposedPort.parse("7687"))
                .withHostConfig(
                        HostConfig
                                .newHostConfig().withPortBindings(PortBinding.parse("7687:7687"), PortBinding.parse("7474:7474"))
                                .withNetworkMode(Constants.NETWORK_NAME)
                )
                .withEnv(List.of(
                        "NEO4J_AUTH=none"
                ))
                .exec();

        dockerClient.startContainerCmd(createContainerResponse.getId()).exec();

        WaitFor.waitForPort(Constants.getNeo4jLocalHostname(), 7474, Constants.getNeo4jTimeout() * 60_000L);

        return new Neo4jParameters("bolt://" + Constants.getNeo4jLocalHostname() + ":7687", "", "");

    }

    private boolean existingNeo4J() {
        var containers = dockerClient.listContainersCmd()
                .withNameFilter(List.of(Constants.NEO4J_CONTAINER_NAME)).exec();
        return !containers.isEmpty();
    }

}
