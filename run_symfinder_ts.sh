#!/bin/bash
set -e
TAG=scp2024

cd js

if ! docker ps | grep -q neo4j; then
    echo Starting database container
    ./start_neo4j.sh
fi

docker run --rm --network varicity-config --name symfinder-ts-cli deathstar3/symfinder-ts-cli:${TAG} $@
