#!/bin/bash


cp -r ../test_projects/ ./data/projects
cp ../run-docker-cli.sh run-docker-cli.sh
chmod +x run-docker-cli.sh
cd data/projects
mvn clean compile clean
cd ../../../

./run-compose.sh
cd integrations
./run-docker-cli.sh -i /data/experiments.yaml -s /data/symfinder.yaml -verbosity ALL -http http://varicityback:3000/projects
python -m pip install requests
python main.py

cd ..
docker-compose -f varicity-front-back.docker-compose.yaml down



