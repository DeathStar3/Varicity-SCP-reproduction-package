#!/bin/bash
#This script build the image to be used with docker
#
set -e

cd symfinder-service
echo  $(pwd)
bash build.sh
cd ../varicity
bash build.sh
cd ../varicity-backend
bash build.sh
cd ..


