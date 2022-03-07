# the first stage of our build will use a maven parent image
FROM maven:3.8.4-openjdk-11-slim AS MAVEN_BUILD

WORKDIR /home
# copy the pom and src code to the container
COPY ./ ./

# Build the executable jar
RUN mvn --no-transfer-progress clean install -DskipTests=true

# the second stage of our build
FROM openjdk:11-jdk-slim

WORKDIR /usr/src
# copy only the artifacts we need from the first stage and discard the rest
COPY --from=MAVEN_BUILD /home/symfindercli/target/symfinder-cli-jar-with-dependencies.jar symfinder-cli.jar
COPY start.sh start.sh
RUN chmod +x start.sh
# set the startup command to execute the jar
ENTRYPOINT ["./start.sh"]