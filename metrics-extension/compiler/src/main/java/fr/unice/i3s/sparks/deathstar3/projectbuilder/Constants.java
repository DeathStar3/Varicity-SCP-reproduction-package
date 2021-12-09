package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import java.util.Optional;

/**
 * We will initialize everything that will be environment specific or
 * configuration input to make the programm run inside docker as well as outside
 *
 * @author VaricityConfig Team : Patrick
 */
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
    private static String SONARQUBE_LOCAL_URL = "http://localhost:9000";
    /**
     * This is the hostname part of the url that can be used to contact neo4j from
     * within a container
     * or from the host depending on where Symfinder is running
     */
    private static String NEO4J_LOCAL_HOSTNAME = "localhost";

    static {
        if (System.getenv("RUNTIME_MODE") != null && System.getenv("RUNTIME_MODE").equals("DOCKER")) {
            SONARQUBE_LOCAL_URL = "http://sonarqubehost:9000";
            NEO4J_LOCAL_HOSTNAME = "symfinder-neo4j";
        }

        SYMFINDER_NEO4J_IMAGE = Optional.ofNullable(System.getenv("SYMFINDER_NEO4J_IMAGE"))
                .orElse("deathstar3/symfinder-neo4j");
        SYMFINDER_NEO4J_TAG = Optional.ofNullable(System.getenv("SYMFINDER_NEO4J_TAG")).orElse("vissoft2021");

        System.out.println("Static initialization");
    }

    private Constants() {

    }

    public static String getSonarqubeLocalUrl() {
        return SONARQUBE_LOCAL_URL;
    }

    public static String getNeo4jLocalHostname() {
        return NEO4J_LOCAL_HOSTNAME;
    }
}
