#!/bin/bash

set -e
xpdirs=/tmp/varicity-xp-projets
if [ -d $xpdirs ]; then
  rm -r $xpdirs
fi

mkdir $xpdirs
SONARQUBE_URL=localhost:9000
workingdir=$(pwd)

# Install wait-for-it
apt-get install wait-for-it

# Projects
## Project 1
git -C $xpdirs clone https://github.com/jfree/jfreechart.git
cd $xpdirs/jfreechart
git checkout 768e0502995a9c55a48fc26d579fe5128ad43539
cd $workingdir

# Build & run custom sonarqube
cd ..
bash build.sh
docker network ls | grep varicity-config > /dev/null || docker network create --driver bridge varicity-config

docker run --detach --name sonarqubehost -p 9000:9000 --network varicity-config --expose=9000 varicity-sonarqube

# Wait for SonarQube to be ready

wait-for-it -t 0 $SONARQUBE_URL

until [ $(curl --silent $SONARQUBE_URL/api/system/status | grep UP -c ) == 1 ]
do
  echo "Sonarqube is not ready"
  sleep 2
done









