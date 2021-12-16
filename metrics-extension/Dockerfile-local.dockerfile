FROM openjdk:11-jdk-slim

WORKDIR /usr/src
# copy only the artifacts we need from the first stage and discard the rest
COPY symfindercli/target/symfinder-cli-jar-with-dependencies.jar symfinder-cli.jar
COPY start.sh start.sh
RUN chmod +x start.sh
# set the startup command to execute the jar
ENTRYPOINT ["./start.sh"]