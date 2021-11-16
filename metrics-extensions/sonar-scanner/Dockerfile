FROM sonarsource/sonar-scanner-cli

RUN apt-get update && apt-get install wait-for-it

WORKDIR /usr/src

COPY start.sh /usr/src/start.sh
RUN chmod +x start.sh


ENTRYPOINT [ "./start.sh" ]