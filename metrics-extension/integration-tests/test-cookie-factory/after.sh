#!/bin/bash
set -e
# Clean up resources

docker container stop sonarqubehost
docker container stop varicityneo4j
docker container rm $(docker container ls -a --quiet)