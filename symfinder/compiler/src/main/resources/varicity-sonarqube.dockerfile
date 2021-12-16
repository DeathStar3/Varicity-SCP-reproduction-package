FROM sonarqube:9.1.0-community

RUN echo "sonar.forceAuthentication=false" >> /opt/sonarqube/conf/sonar.properties
