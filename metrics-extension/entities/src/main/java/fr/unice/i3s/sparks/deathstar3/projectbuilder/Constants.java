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
 * configuration input to make the programm run inside docker as well as outside
 *
 * @author VaricityConfig Team : Patrick
 */
@Slf4j
public final class Constants {

    public static final String NETWORK_NAME = "varicity-config";
    public static final String COMPILER_SCANNER_NAME = "varicity-compiler-scanner-container";
    public static final String COMPILER_NAME = "varicity-compiler-container";
    public static final String SCANNER_NAME = "varicity-scanner-container";
    public static final String SONARQUBE_DOCKER_URL = "http://sonarqubehost:9000";
    public static final String SONAR_SCANNER_IMAGE = "sonarsource/sonar-scanner-cli";
    public static final String SONAR_SCANNER_IMAGE_TAG = "4";
    public static String SYMFINDER_NEO4J_IMAGE;
    public static String SYMFINDER_NEO4J_TAG;
    /**
     * The Symfinder Neo4J container name.
     */
    public static String NEO4J_CONTAINER_NAME = "symfinder-neo4j";
    /**
     * Host name provided to the docker deamon to build for the neo4j container
     */
    public static String NEO4J_HOSTNAME = "symfinder-neo4j";
    private static String SYMFINDER_VERSION;
    private static String JAVA_PATH;
    private static String SONARQUBE_LOCAL_URL = "http://localhost:9000";
    /**
     * This is the hostname part of the url that can be used to contact neo4j from
     * within a container
     * or from the host depending on where Symfinder is running
     */
    private static String NEO4J_LOCAL_HOSTNAME = "localhost";

    private static int IMAGE_DOWNLOAD_TIMEOUT = 20;

    private static int NEO4J_TIMEOUT = 3;

    private static int NEO4J_MAX_RETRIES = 20;

    static {
        log.info("Initializing constants based on environment variables...");

        if (System.getenv("SYMFINDER_VERSION") != null) {
            SYMFINDER_VERSION = System.getenv("SYMFINDER_VERSION");
        }

        JAVA_PATH = Optional.ofNullable(System.getProperty("SYMFINDER_JAVA_CLASSPATH")).or(() -> Optional.ofNullable(System.getenv("JAVA_HOME"))).or(() -> Optional.of("/usr/lib/jvm/java-11-openjdk-amd64")).get();

        if (System.getenv("IMAGE_DOWNLOAD_TIMEOUT") != null && NumberUtils.isParsable(System.getenv("IMAGE_DOWNLOAD_TIMEOUT"))) {
            IMAGE_DOWNLOAD_TIMEOUT = Integer.parseInt(System.getenv("IMAGE_DOWNLOAD_TIMEOUT"));
            log.info("IMAGE_DOWNLOAD_TIMEOUT is set to " + IMAGE_DOWNLOAD_TIMEOUT);
        }

        if (System.getenv("RUNTIME_MODE") != null && System.getenv("RUNTIME_MODE").equals("DOCKER")) {
            log.info("We are INSIDE DOCKER");
            SONARQUBE_LOCAL_URL = "http://sonarqubehost:9000";
            NEO4J_LOCAL_HOSTNAME = "symfinder-neo4j";
        }

        SYMFINDER_NEO4J_IMAGE = Optional.ofNullable(System.getenv("SYMFINDER_NEO4J_IMAGE"))
                .orElse("deathstar3/symfinder-neo4j");
        SYMFINDER_NEO4J_TAG = Optional.ofNullable(System.getenv("SYMFINDER_NEO4J_TAG")).orElse("vissoft2021");

        log.info("Using Neo4j {}:{}", SYMFINDER_NEO4J_IMAGE, SYMFINDER_NEO4J_TAG);
    }

    private Constants() {

    }

    public static String getSonarqubeLocalUrl() {
        return SONARQUBE_LOCAL_URL;
    }

    public static String getNeo4jLocalHostname() {
        return NEO4J_LOCAL_HOSTNAME;
    }

    public static int getImageDownloadTimeout() {
        return IMAGE_DOWNLOAD_TIMEOUT;
    }

    public static int getNeo4jTimeout() {
        return NEO4J_TIMEOUT;
    }

    public static String getSymfinderVersion() {
        return SYMFINDER_VERSION;
    }

    public static String getJavaPath() {
        return JAVA_PATH;
    }
}
