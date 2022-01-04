#!/usr/bin/env bash

  #########################################################
  # Symfinder
  #########################################################

echo " ### [1;32m Build metric-extension (1/1)[0m"
mvn clean install -Dmaven.test.skip=true

mkdir -p ./../target
cp ./target/config-loader-1.0-SNAPSHOT-jar-with-dependencies.jar ./../target/symfinder-1.0-SNAPSHOT.jar

#read