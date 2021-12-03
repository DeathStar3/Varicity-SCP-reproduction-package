# the first stage of our build will use a maven parent image
FROM maven:3.8.3-openjdk-17 AS MAVEN_BUILD

WORKDIR /home
# copy the pom and src code to the container
COPY ./ ./

# Build the executable jar
RUN mvn clean compile assembly:single -DskipTests=true

# the second stage of our build
FROM openjdk:17-bullseye

WORKDIR /usr/src
# copy only the artifacts we need from the first stage and discard the rest
COPY --from=MAVEN_BUILD /home/config-loader/target/config-loader-1.0-SNAPSHOT-jar-with-dependencies.jar symfinder-cli.jar
# set the startup command to execute the jar
CMD java -jar symfinder-cli.jar