#!/bin/bash
set -e

cd ../../metrics-extension

#58
mvn clean verify -Dtest=MetricExtensionEntrypointTest#whenSkipSymfinderIsTrueAndMetricSourceIsInriaSonarQube -DfailIfNoTests=false

#58
mvn clean verify -Dtest=MetricExtensionEntrypointTest#whenSkipSymfinderIsTrueAndMetricSourceIsLocalSonarQube  -DfailIfNoTests=false


