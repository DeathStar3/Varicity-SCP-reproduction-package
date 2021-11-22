#!/bin/bash

docker network ls | grep varicity-config > /dev/null || docker network create --driver bridge varicity-config

docker run --name sonarqubehost -p 9000:9000 --network varicity-config --expose=9000 varicity-sonarqube 
