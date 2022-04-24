FROM sonarqube:9.1.0-community

RUN echo "sonar.forceAuthentication=false" >> /opt/sonarqube/conf/sonar.properties
RUN echo "sonar.search.javaAdditionalOpts=-Dcluster.routing.allocation.disk.threshold_enabled=false -Dcluster.routing.allocation.disk.watermark.flood_stage=99%" >> /opt/sonarqube/conf/sonar.properties
