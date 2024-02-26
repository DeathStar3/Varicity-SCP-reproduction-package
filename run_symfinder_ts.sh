#!/bin/bash
set -e
TAG=ts
docker run deathstar3/symfinder-cli:${TAG} $@
