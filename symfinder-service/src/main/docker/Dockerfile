# the first stage of our build will use a maven parent image
FROM maven:3.8.3-openjdk-17 AS MAVEN_BUILD

# copy the pom and src code to the container
COPY ./ ./

EXPOSE 8080
#package the dependency
RUN mvn clean install -DskipTests=true -f metrics-extension/pom.xml
# package our application code
RUN mvn clean package -DskipTests=true

# the second stage of our build
FROM openjdk:17-bullseye

WORKDIR /usr/src
# copy only the artifacts we need from the first stage and discard the rest
COPY --from=MAVEN_BUILD /target target
COPY start.sh start.sh
RUN chmod +x start.sh
RUN ls /usr/src/target
# set the startup command to execute the jar
ENTRYPOINT ["./start.sh"]