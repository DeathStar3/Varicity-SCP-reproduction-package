#!/bin/bash

docker run --detach --name varicityneo4j --publish=7474:7474 --publish=7687:7687 --rm -e NEO4J_AUTH=none  deathstar3/symfinder-neo4j:vissoft2021

sudo apt-get install wait-for-it

wait-for-it -t 0 localhost:7474
