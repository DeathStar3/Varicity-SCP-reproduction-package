#!/bin/bash

set -e

docker run --detach --rm  --publish 9090:9090 deathstar3/varicity:local

docker run --detach --rm  --publish 3000:3000 deathstar3/varicity-backend:local


java -jar  symfinder-service/target/quarkus-app/quarkus-run.jar

