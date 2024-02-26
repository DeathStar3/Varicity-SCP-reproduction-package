#!/bin/bash

set -e

TAG=ts

cd js
echo "building the symfinder engine"
docker build -f Dockerfile -t deathstar3/symfinder-cli:${TAG} .