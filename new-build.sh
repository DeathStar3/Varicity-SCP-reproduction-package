#!/bin/bash

set -e

# Installer le jar de l'extension dans le repo maven local
cd metrics-extension
bash build.sh
mvn clean install -DskipTests=true
cd ../symfinder-service
mvn clean package -DskipTests=true
cd ../varicity
bash build.sh
cd ../varicity-backend
bash build.sh


