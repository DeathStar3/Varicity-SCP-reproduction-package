#!/bin/bash
set -e
xpdirs=/tmp/varicity-xp-projets

# Run maven tests
cd ../../metrics-extension
mvn clean verify -Dtest=CompilerTest#executeTest

if [ ! -d $xpdirs/jfreechart/target ]; then
  exit 1
fi