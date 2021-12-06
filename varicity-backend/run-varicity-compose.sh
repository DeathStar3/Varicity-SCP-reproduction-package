#!/bin/bash


export TAG=local
export VOLUME_PATH=$(pwd)/dockervolume
export UID=$(id -u)
export GID=$(id -g)
docker-compose up