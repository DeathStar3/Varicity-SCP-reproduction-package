#!/bin/bash
set -e
# Clean up resources

docker container rm --force $(docker container ls -a --quiet)