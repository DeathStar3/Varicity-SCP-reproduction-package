#!/bin/bash
set -e

cd ../../

#58
mvn clean verify -Dtest=MetricExtensionEntrypointTest#whenSkipSymfinderIsTrueAndMetricSourceIsInriaSonarQube -DfailIfNoTests=false

#58
mvn clean verify -Dtest=MetricExtensionEntrypointTest#whenSkipSymfinderIsTrueAndMetricSourceIsLocalSonarQube  -DfailIfNoTests=false


