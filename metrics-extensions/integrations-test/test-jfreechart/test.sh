#!/bin/bash
set -e
xpdirs=/tmp/varicity-xp-projets

# Run maven tests
cd ../../../metrics-extension
mvn clean verify -Dtest=CompilerIT#executeTest -DfailIfNoTests=false

if [ ! -d $xpdirs/jfreechart/target ]; then
  exit 1
fi