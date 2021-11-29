#!/bin/bash
set -e

cd ../../../metrics-extension
mvn clean verify -Dtest=MetricExtensionEntrypointTest#runExperimentTest -DfailIfNoTests=false


