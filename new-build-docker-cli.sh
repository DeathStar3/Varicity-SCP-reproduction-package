#!/bin/bash

set -e


cd metrics-extension
docker build -f Dockerfile -t deathstar3/symfinder-cli:local .
cp metrics-extension/config-loader/target/config-loader-1.0-SNAPSHOT-jar-with-dependencies.jar bin/symfinder-cli.jar/s