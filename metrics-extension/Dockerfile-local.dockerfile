FROM openjdk:17-bullseye

WORKDIR /usr/src
# copy only the artifacts we need from the first stage and discard the rest
COPY config-loader/target/config-loader-1.0-SNAPSHOT-jar-with-dependencies.jar symfinder-cli.jar
COPY start.sh start.sh
RUN chmod +x start.sh
# set the startup command to execute the jar
ENTRYPOINT ["/usr/src/start.sh"]