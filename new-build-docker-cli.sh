#!/bin/bash

set -e


cd metrics-extension
docker build -f Dockerfile -t deathstar3/symfinder-cli:local .