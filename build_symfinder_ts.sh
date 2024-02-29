#!/bin/bash

set -e

TAG=scp2024

cd js/app
echo "building the Symfinder-TS engine"
docker build -f Dockerfile -t deathstar3/symfinder-ts-cli:${TAG} .