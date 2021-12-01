#!/usr/bin/env bash

  #########################################################
  # Metrics-Extension
  #########################################################

echo " ### [1;32m Build metric-extension (1/1)[0m"
mvn clean install -Dmaven.test.skip=true
cd ./config-loader
mvn clean compile assembly:single -DskipTests=true

mkdir -p ./../target
cp ./target/config-loader-1.0-SNAPSHOT-jar-with-dependencies.jar ./../target/metrics-extension-1.0-SNAPSHOT.jar

#read