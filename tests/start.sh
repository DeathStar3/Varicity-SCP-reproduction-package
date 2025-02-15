#!/bin/bash

set -e

cp ../run-docker-cli.sh run-docker-cli.sh
chmod +x run-docker-cli.sh
cd data/projects
mvn clean compile clean
cd ../../

docker run --expose 3000 --name varicityback --network varicity-config --detach -p 3000:3000 deathstar3/varimetrics-backend:local
./run-docker-cli.sh -i /data/experiments.yaml -s /data/symfinder.yaml -verbosity ALL -http http://varicityback:3000/projects
python3 -m pip install requests
python3 main.py

cd ..
docker-compose -f varicity-front-back.docker-compose.yaml down



