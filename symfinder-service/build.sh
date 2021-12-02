!/bin/bash

cp ../metrics-extension metrics-extension
docker build -f src/main/docker/Dockerfile -t deathstar3/symfinder-service:local .
rm -r metrics-extension