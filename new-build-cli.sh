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


cd metrics-extension
echo " ### [1;32m Build metric-extension (1/1)[0m"
mvn clean install -Dmaven.test.skip=true
cd ..

create_directory bin

cp metrics-extension/symfindercli/target/symfinder-cli-jar-with-dependencies.jar bin/symfinder-cli.jar