#!/bin/bash
set -e
xpdirs=/tmp/varicity-xp-projects

# Run maven tests
cd ../../../metrics-extension
mvn clean verify -Dtest=CompilerTest#compileAndScanArgoUmlSPL -DfailIfNoTests=false



echo "************************"
echo "************************"
echo "************************"
echo "************************"


docker container logs varicity-compiler-container > log-varicity-compiler-container.txt
docker container logs varicity-scanner-container > log-varicity-scanner-container.txt


cat log-varicity-compiler-container.txt

echo "************************"
echo "************************"
echo "************************"
echo "************************"

cat log-varicity-scanner-container.txt
echo "************************"
echo "************************"
echo "************************"
echo "************************"