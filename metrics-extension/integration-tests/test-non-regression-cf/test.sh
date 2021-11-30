#!/bin/bash
set -e

cd ../../
mvn clean verify -Dtest=MetricExtensionEntrypointTest#nonRegressionTest -DfailIfNoTests=false


