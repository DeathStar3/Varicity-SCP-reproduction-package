#!/bin/bash

#This will build the image of the Symfinder Extension CLI

mvn clean install -Dmaven.test.skip=true
docker build -f Dockerfile-local.dockerfile -t deathstar3/symfinder-cli:local .