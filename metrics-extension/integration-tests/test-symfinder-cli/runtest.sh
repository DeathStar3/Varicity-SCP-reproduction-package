#!/bin/bash
set -e

#before
sudo apt-get install wait-for-it
python -m pip install requests
docker network ls | grep varicity-config > /dev/null || docker network create --driver bridge varicity-config
docker run --expose 3000 --name varicity-backend --network varicity-config --detach -p 3000:3000 deathstar3/varicity-backend:local

wait-for-it -t 0 localhost:3000

#test itself
docker run -v $(pwd)/test_config_file:/data --network varicity-config -v /var/run/docker.sock:/var/run/docker.sock:ro -e RUNTIME_MODE=DOCKER  deathstar3/symfinder-cli:local -i /data/junit-r4.13.2-config.yaml -s /data/symfinder.yaml -verbosity INFO -http http://varicity-backend:3000/projects

python main.py
#after
docker container rm --force $(docker container ls -a --quiet)