/*
 * This file is part of symfinder.
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
 */

package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.math.NumberUtils;

import java.util.Optional;

/**
 * We will initialize everything that will be environment specific or
 * configuration input to make the program run inside docker as well as outside
 *
 * @author VaricityConfig Team : Patrick
 */
@Slf4j
public final class Constants {
    //================================================================================
    // GENERAL
    //================================================================================

    /**
     * The Symfinder version.
     */
    public static final String SYMFINDER_VERSION = Optional.ofNullable(System.getenv("SYMFINDER_VERSION"))
        .orElse("undefined");

    /**
     * The path to the Java binaries.
     */
    public static final String JAVA_PATH = Optional.ofNullable(System.getProperty("SYMFINDER_JAVA_CLASSPATH"))
        .or(()-> Optional.ofNullable(System.getenv("JAVA_HOME")))
        .or(()-> Optional.of( "/usr/lib/jvm/java-11-openjdk-amd64"))
        .get();

    //================================================================================
    // DOCKER
    //================================================================================

    /**
     * The name of the network shared by the Docker containers.
     */
    public static final String NETWORK_NAME = Optional.ofNullable(System.getenv("NETWORK_NAME"))
        .orElse("varicity-config");

    /**
     * The maximum time to wait for a Docker image download (in minutes).
     */
    public static final int IMAGE_DOWNLOAD_TIMEOUT;

    //================================================================================
    // COMPILER
    //================================================================================

    /**
     * The Symfinder compiler container name.
     */
    public static final String COMPILER_NAME = Optional.ofNullable(System.getenv("COMPILER_NAME"))
        .orElse("varicity-compiler-container");

    /**
     * The Symfinder scanner container name.
     */
    public static final String SCANNER_NAME = Optional.ofNullable(System.getenv("SCANNER_NAME"))
        .orElse("varicity-scanner-container");

    /**
     * The Symfinder compiler scanner container name.
     */
    public static final String COMPILER_SCANNER_NAME = Optional.ofNullable(System.getenv("COMPILER_SCANNER_NAME"))
        .orElse("varicity-compiler-scanner-container");

    //================================================================================
    // NEO4J
    //================================================================================

    /**
     * The Symfinder Neo4J image name.
     */
    public static final String SYMFINDER_NEO4J_IMAGE = Optional.ofNullable(System.getenv("SYMFINDER_NEO4J_IMAGE"))
        .orElse("deathstar3/symfinder-neo4j");

    /**
     * The Symfinder Neo4J image tag.
     */
    public static final String SYMFINDER_NEO4J_TAG = Optional.ofNullable(System.getenv("SYMFINDER_NEO4J_TAG"))
        .orElse("vissoft2021");

    /**
     * The Symfinder Neo4J container name.
     */
    public static final String NEO4J_CONTAINER_NAME = Optional.ofNullable(System.getenv("NEO4J_CONTAINER_NAME"))
        .orElse("symfinder-neo4j");

    /**
     * The Symfinder Neo4J host name.
     */
    public static final String NEO4J_HOSTNAME = Optional.ofNullable(System.getenv("NEO4J_HOSTNAME"))
        .orElse("symfinder-neo4j");

    /**
     * This is the hostname part of the URL that can be used to contact Neo4J from within a container
     * or from the host depending on where Symfinder is running.
     */
    public static final String NEO4J_LOCAL_HOSTNAME;

    /**
     * The maximum time to wait for the Neo4J container (in minutes).
     */
    public static final int NEO4J_TIMEOUT;

    //================================================================================
    // SONARQUBE
    //================================================================================

    /**
     * The SonarQube image name.
     */
    public static final String SONAR_SCANNER_IMAGE = Optional.ofNullable(System.getenv("SONAR_SCANNER_IMAGE"))
        .orElse("sonarsource/sonar-scanner-cli");

    /**
     * The SonarQube image tag.
     */
    public static final String SONAR_SCANNER_IMAGE_TAG = Optional.ofNullable(System.getenv("SONAR_SCANNER_IMAGE_TAG"))
        .orElse("4");

    /**
     * The SonarQube container name;
     */
    public static final String SONARQUBE_CONTAINER_NAME = Optional.ofNullable(System.getenv("SONARQUBE_CONTAINER_NAME"))
        .orElse("sonarqubehost");

    /**
     * The SonarQube URL (from outside the network).
     */
    public static final String SONARQUBE_LOCAL_URL;

    /**
     * The SonarQube URL (from within the network).
     */
    public static final String SONARQUBE_DOCKER_URL = Optional.ofNullable(System.getenv("SONARQUBE_DOCKER_URL"))
        .orElse("http://" + SONARQUBE_CONTAINER_NAME + ":9000");

    static {
        log.info("Initializing constants based on environment variables...");

        // Runtime mode.
        if (System.getenv("RUNTIME_MODE") != null && System.getenv("RUNTIME_MODE").equals("DOCKER")) {
            log.info("Running inside Docker.");
            NEO4J_LOCAL_HOSTNAME = NEO4J_HOSTNAME;
            SONARQUBE_LOCAL_URL = SONARQUBE_DOCKER_URL;

        } else {
            NEO4J_LOCAL_HOSTNAME = "localhost";
            SONARQUBE_LOCAL_URL = "http://localhost:9000";
        }

        // Image download timeout.
        if (System.getenv("IMAGE_DOWNLOAD_TIMEOUT") != null && NumberUtils.isParsable(System.getenv("IMAGE_DOWNLOAD_TIMEOUT"))) {
            IMAGE_DOWNLOAD_TIMEOUT = Integer.parseInt(System.getenv("IMAGE_DOWNLOAD_TIMEOUT"));
            log.info("IMAGE_DOWNLOAD_TIMEOUT is set to " + IMAGE_DOWNLOAD_TIMEOUT);
        } else {
            IMAGE_DOWNLOAD_TIMEOUT = 20;
        }

        // Symfinder Neo4J.
        log.info("Using Neo4j {}:{}", SYMFINDER_NEO4J_IMAGE, SYMFINDER_NEO4J_TAG);
        if (System.getenv("NEO4J_TIMEOUT") != null && NumberUtils.isParsable(System.getenv("NEO4J_TIMEOUT"))) {
            NEO4J_TIMEOUT = Integer.parseInt(System.getenv("NEO4J_TIMEOUT"));
        } else {
            NEO4J_TIMEOUT = 3;
        }
    }

    /**
     * Prevents the instantiation of this class.
     */
    private Constants() {
        throw new IllegalStateException("Constants should not be instantiated.");
    }
}
