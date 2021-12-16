#!/bin/bash
set -e

cd ../../
mvn clean verify -Dtest=MetricExtensionEntrypointTest#runExperimentTest -DfailIfNoTests=false


