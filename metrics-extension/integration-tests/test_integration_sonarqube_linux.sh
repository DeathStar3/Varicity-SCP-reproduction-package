#!/usr/bin/env bash

  #########################################################
  # Metrics-Extension Integration test (linux)
  #########################################################

echo " ### ### [1;32m Integration test for metric-extension (linux) [0m### ### "

echo " ### [1;32m Step: 0/3 - Clean environement [0m"
rm -R -d ./test_actual_result
rm -R -d ./../target

echo " ### [1;32m Step: 1/3 - Build metrics-extension [0m"
cd ./../
chmod +x ./build.sh
./build.sh
cd ./integration-tests

echo " ### [1;32m Step: 2/3 - Run metrics-extension [0m"
java -jar ./../target/metrics-extension-1.0-SNAPSHOT.jar ./test_config_file/junit-r4.13.2-config-linux.yaml debug

echo " ### [1;32m Step: 3/3 - Assert result [0m"

RESULT_FILE_NAME=$(find ./test_actual_result -type f -printf "%f\n") # Find file name

DIFF=$(diff ./test_expected_result/junit-r4.13.2-expected-linux.json ./test_actual_result/junit-r4.13.2/${RESULT_FILE_NAME}) #Compare files

if [ ! -z "${DIFF}" ]; then # Check if the comparison result is an empty string
  echo " ### [1;31m TEST FAIL [0m"
  exit 1 # Fail
fi
  echo " ### [1;32m TEST SUCCESS [0m"
  exit 0 # Success