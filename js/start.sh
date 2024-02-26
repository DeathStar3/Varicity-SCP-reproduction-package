#!/bin/sh
if [ ! -d experiments ]; then
    mkdir experiments
fi
if [ ! -d ./app/export ]; then
    mkdir ./app/export
fi

# Environment variables
HTTP_PATH=""

################################################################################
# Functions
set_http()
{
  HTTP_PATH="$1"
  if [ "$HTTP_PATH" = "" ]; then
    HTTP_PATH=http://localhost:3000/projects
    echo "Url is incorrect or unreachable. Using default one \"$HTTP_PATH\"."
  else
    echo "Path to server manually defined."
    echo "HTTP_PATH : $HTTP_PATH"
    echo
  fi
}

help()
{
  echo "USAGE: $0 [OPTIONS] PROJECT_URL"
  echo "Options:"
  echo " -http HTTP_PATH    Defined server to send result"
  echo " -h,  --help        Print this message"
  echo " -v,  --version     Print version (not yet implemented)"
  echo
}
################################################################################

PROJECT_URL=""
NB_MAX_ARGS=$#
NB_ARG=0
# Parse the arguments
while true; do
  if [ "$NB_ARG" -ge "$NB_MAX_ARGS" ]; then
      break
  fi
  let NB_ARG++
  echo "$1"
  case "$1" in
  -http) set_http "$2"; shift 2;  ;; # Output http path
  -h |--help) # Help message
    help
    shift ;;
  http*) PROJECT_URL="$1" ; shift 1;; # Project path
  esac
done

if [ "$PROJECT_URL" = "" ];then
  echo "Have to provide a url for the project path. Exiting..."
  exit 22
fi

echo "Project \"$PROJECT_URL\" will be analyse."
if [ "$HTTP_PATH" != "" ]; then
  echo "Project results will be send to server \"$HTTP_PATH\""
fi
echo

# Downloading the project
project=$(basename -- "$PROJECT_URL")
path=experiments/$project

if [ ! -d "$path" ]; then
    echo Download at "$PROJECT_URL"
    mkdir download
    cd download
    wget -q --show-progress -O "$project".zip "$PROJECT_URL"/archive/master.zip
    if [ ! -f "$project".zip ]; then
        echo Project \'"$project"\' not find...
        cd ..
        rm -rd download
        exit 1
    fi
    unzip -q "$project".zip
    rm "$project".zip
    mv $(ls) ../experiments/"$project"
    cd ..
    rm -d download
fi

echo Anlysing project: "$project"
echo HERE BANANA
cd app
pwd
echo HERE APPLE
# npm run build

# Export environment variables
PROJECT_PATH=$path
UV_THREADPOOL_SIZE=$(nproc)
export HTTP_PATH
export PROJECT_PATH
export UV_THREADPOOL_SIZE

echo "HTTP : $HTTP_PATH"
echo "PROJECT : $PROJECT_PATH"

# Run Symfidner JS
node lib/index.js

