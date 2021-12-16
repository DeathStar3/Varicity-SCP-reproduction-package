#!/bin/bash
set -e
xpdirs=/tmp/varicity-xp-projects

# Run maven tests
cd ../../../symfinder
mvn clean verify -Dtest=CompilerTest#executeTest -DfailIfNoTests=false

if [ ! -d $xpdirs/jfreechart/target ]; then
  echo "No target folder, build did not occur, test failed"
  exit 1
fi

echo "************************"
echo "************************"
echo "************************"
echo "************************"


docker container logs varicity-compiler-scanner-container

echo "************************"
echo "************************"
echo "************************"
echo "************************"