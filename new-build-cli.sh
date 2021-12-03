#!/bin/bash

set -e

create_directory(){
    if [[ ! -d "$1" ]]; then
        echo "Creating $1 directory"
        mkdir "$1"
    else
        echo "$1 directory already exists"
    fi
}

# Installer le jar de l'extension dans le repo maven local
cd metrics-extension
echo " ### [1;32m Build metric-extension (1/1)[0m"
mvn clean install -Dmaven.test.skip=true
cd config-loader
mvn clean compile assembly:single -DskipTests=true
cd ../../

create_directory bin

cp metrics-extension/config-loader/target/config-loader-1.0-SNAPSHOT-jar-with-dependencies.jar bin/symfinder-cli.jar