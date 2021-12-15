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

package fr.unice.i3s.sparks.deathstar3.utils;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateNetworkResponse;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.command.PullImageResultCallback;
import com.github.dockerjava.api.model.Bind;
import com.github.dockerjava.api.model.Container;
import com.github.dockerjava.api.model.Network;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.Constants;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static fr.unice.i3s.sparks.deathstar3.projectbuilder.Constants.NETWORK_NAME;

@Slf4j
public class Utils {

    private final DockerClient dockerClient;

    public Utils() {
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

    public boolean checkIfImageExists(String image, String tag) {
        return dockerClient.listImagesCmd().exec().stream()
                .anyMatch(img -> Arrays.stream(img.getRepoTags()).anyMatch(name -> name.equals(image + ":" + tag)));
    }

    public boolean checkIfContainerHasExited(String containerId) {
        InspectContainerResponse container = dockerClient.inspectContainerCmd(containerId).exec();
        log.info(container.getState().toString());
        log.info(containerId + " : " + container.getState().getStatus());
        return container.getState().getStatus().strip().equals("exited");
    }

    public void removeOldExitedContainer(String containerName) {
        var containers = dockerClient.listContainersCmd()
                .withShowAll(true)
                .withStatusFilter(List.of("exited")).withNameFilter(List.of(containerName)).exec();
        for (var container : containers) {
            dockerClient.removeContainerCmd(container.getId())
                    .exec();
        }
    }

    public void createNetwork() {
        List<Network> networks = dockerClient.listNetworksCmd().withNameFilter(NETWORK_NAME).exec();
        if (networks.isEmpty()) {
            CreateNetworkResponse networkResponse = dockerClient.createNetworkCmd().withName(NETWORK_NAME)
                    .withAttachable(true).withDriver("bridge").exec();
            log.info(String.format("Network %s created...%n", networkResponse.getId()));
        }
    }

    public void downloadImage(String image, String tag) throws InterruptedException {
        dockerClient.pullImageCmd(image).withTag(tag).exec(new PullImageResultCallback()).awaitCompletion(Constants.IMAGE_DOWNLOAD_TIMEOUT,
                TimeUnit.MINUTES);
    }

    public Container getCurrentContainer() throws UnknownHostException {
        String hostname = InetAddress.getLocalHost().getHostName();
        var containers = dockerClient.listContainersCmd().exec();

        for (var container : containers) {
            var containerHostname = dockerClient.inspectContainerCmd(container.getId()).exec().getConfig().getHostName();
            if (containerHostname.equals(hostname)) {
                return container;
            }
        }
        return null;
    }

    /**
     * If Symfinder is running in docker then the path provided must be absolute to the docker container
     * eg: If you mount a local directory to the /data directoy in the docker container then
     * /data/myprojets/project
     *
     * @param path
     * @return
     * @throws UnknownHostException
     * @author Patrick
     * Inspired by https://gist.github.com/dpfoose/f96d4e4b76c2e01265619d545b77987a
     */
    public String translatePath(String path) throws UnknownHostException {
        var currentContainer = this.getCurrentContainer();
        if (currentContainer != null) {
            InspectContainerResponse inspectContainerResponse = dockerClient.inspectContainerCmd(currentContainer.getId()).exec();

            Bind[] binds = inspectContainerResponse.getHostConfig().getBinds();
            if (binds != null && binds.length != 0) {
                for (var bind : binds) {
                    if (path.equals(bind.getVolume().getPath())) {
                        return Path.of(bind.getPath(), path).toString();
                    }
                    if (path.startsWith(bind.getVolume().getPath())) {
                        return Path.of(bind.getPath(), path.substring(bind.getVolume().getPath().length())).toString();
                    }
                }
            }
        }
        return path;
    }


    public String getUserIdentity() {
        String user = "1000";
        String group = "1000";
        if (OSUtils.isUnix()) {
            Runtime rt = Runtime.getRuntime();
            try {
                Process process = rt.exec("id -u");
                Process getGroup = rt.exec("id -g");
                int exitCode = process.waitFor();
                int exitCodeGroup = getGroup.waitFor();
                if (exitCode == 0) {
                    user = new String(process.getInputStream().readAllBytes()).strip();
                }
                if (exitCodeGroup == 0) {
                    group = new String(getGroup.getInputStream().readAllBytes()).strip();
                }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }

        return user + ":" + group;
    }


}
