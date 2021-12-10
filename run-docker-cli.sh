#!/bin/bash
set -e
docker network ls | grep varicity-config > /dev/null || docker network create --driver bridge varicity-config
docker run -v $(pwd)/data:/data --network varicity-config -v /var/run/docker.sock:/var/run/docker.sock:ro -e RUNTIME_MODE=DOCKER  deathstar3/symfinder-cli:local $@
