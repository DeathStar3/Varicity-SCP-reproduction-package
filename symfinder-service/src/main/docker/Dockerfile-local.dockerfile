FROM openjdk:17-bullseye

WORKDIR /usr/src
# copy only the artifacts we need from the first stage and discard the rest
COPY target target
COPY start.sh start.sh
RUN chmod +x start.sh
RUN ls /usr/src/target
RUN ls /usr/src
# set the startup command to execute the jar
ENTRYPOINT ["bash", "/usr/src/start.sh"]