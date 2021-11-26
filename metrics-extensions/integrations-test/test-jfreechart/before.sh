#!/bin/bash

set -e
xpdirs=/tmp/varicity-xp-projects
if [ -d $xpdirs ]; then
  sudo rm -r $xpdirs
fi

mkdir $xpdirs
SONARQUBE_URL=localhost:9000
workingdir=$(pwd)

# Install wait-for-it
sudo apt-get install wait-for-it

# Projects
## Project 1
git -C $xpdirs clone https://github.com/jfree/jfreechart.git
cd $xpdirs/jfreechart
git checkout 768e0502995a9c55a48fc26d579fe5128ad43539
cd $workingdir