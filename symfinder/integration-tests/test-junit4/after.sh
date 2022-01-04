#!/bin/bash
set -e
# Clean up resources
docker container stop sonarqubehost
docker container rm $(docker container ls -a --quiet)