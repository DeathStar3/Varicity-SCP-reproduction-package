#!/bin/bash

docker run --name sonarqubehost -p 9000:9000 --network varicity-config --expose=9000 varicity-sonarqube 
