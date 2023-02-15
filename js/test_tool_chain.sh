#!/bin/bash

function analyse() {
  project=$1
  commit=$2
  project_name=$(basename -- $1)
  path=experiments/$project_name
  if [ ! -d $path ]; then
    mkdir download
    cd download
    wget -q --show-progress -O $project_name.zip $project/archive/$commit.zip
    if [ ! -f $project_name.zip ]; then
      echo Project \'$project_name\' not find...
      cd ..
      rm -rd download
      exit 1
    fi
    unzip -q $project_name.zip
    rm $project_name.zip
    mv $(ls) ../experiments/$project_name
    cd ..
    rm -d download
  fi
  cd app
  npm run --silent build
  PROJECT_PATH=$path UV_THREADPOOL_SIZE=$(nproc) node lib/index.js -sf
}

function check() {
  project=$(basename -- $1)
  files_count=$(jq '.files_count' ./result_stats.json)
  variants_count=$(jq '.variants_count' ./result_stats.json)
  nodes_count=$(jq '.nodes_count' ./result_stats.json)
  relationships_count=$(jq '.relationships_count' ./result_stats.json)
  unknown_paths_count=$(jq '.unknown_paths_count' ./result_stats.json)

  echo "==== $project ===="
  if [ $files_count -eq $2 ]; then
    echo "Files count: OK"
  else
    echo "Files count: excepted $2 but have $files_count"
  fi
  if [ $variants_count -eq $3 ]; then
    echo "Variants count: OK"
  else
    echo "Variants count: excepted $3 but have $variants_count"
  fi
  if [ $nodes_count -eq $4 ]; then
    echo "Nodes count: OK"
  else
    echo "Nodes count: excepted $4 but have $nodes_count"
  fi
  if [ $relationships_count -eq $5 ]; then
    echo "Relationships count: OK"
  else
    echo "Relationships count: excepted $5 but have $relationships_count"
  fi
  if [ $unknown_paths_count -eq $6 ]; then
    echo "Unknown paths count: OK"
  else
    echo "Unknown paths count: excepted $6 but have $unknown_paths_count"
  fi
  echo "=====$(echo $project | sed 's/./=/g')====="
}

#function compare() {
#  if [ $1 = ${projects[0]} ]; then
#    check $1 275 17 7374 8318 0
#  elif [ $1 = ${projects[1]} ]; then
#    check $1 639 501 20731 26390 1
#  elif [ $1 = ${projects[2]} ]; then
#    check $1 1180 342 14732 19256 6
#  elif [ $1 = ${projects[3]} ]; then
#    check $1 499 112 9519 11809 3
#  elif [ $1 = ${projects[4]} ]; then
#    check $1 644 211 25989 29219 9
#  fi
#}

for ((i = 1; i <= $#; i += 7)); do
  project=${!i}
  commit_pos=$(($i + 1))
  commit=${!commit_pos}
  files_count_pos=$(($i + 2))
  files_count=${!files_count_pos}
  variants_count_pos=$(($i + 3))
  variants_count=${!variants_count_pos}
  nodes_count_pos=$(($i + 4))
  nodes_count=${!nodes_count_pos}
  relationships_count_pos=$(($i + 5))
  relationships_count=${!relationships_count_pos}
  unknown_paths_count_pos=$(($i + 6))
  unknown_paths_count=${!unknown_paths_count_pos}

  analyse $project $commit
  check $project $files_count $variants_count $nodes_count $relationships_count $unknown_paths_count
  cd ..
done
