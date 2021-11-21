#!/bin/bash

set -e
xpdirs=/tmp/varicity-xp-projets
if [ -d $xpdirs ]; then
  sudo rm -r $xpdirs
fi

mkdir $xpdirs
SONARQUBE_URL=localhost:9000
workingdir=$(pwd)

# Projects
## Project 1
git -C $xpdirs clone https://github.com/junit-team/junit4.git
cd $xpdirs/junit4
git checkout r4.12
cd $workingdir










