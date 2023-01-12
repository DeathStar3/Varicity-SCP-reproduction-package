if [ ! -d experiments ]; then
    mkdir experiments
fi

if ! docker ps | grep -q neo4j; then
    echo Starting docker
    docker run -d -p7474:7474 -p7687:7687 -e NEO4J_AUTH=neo4j/root neo4j:4.1.9
fi
project=$(basename -- $1)
path=experiments/$project

if [ ! -d $path ]; then
    echo Download at $1
    mkdir download
    cd download
    echo "DOWLOADING : $(pwd)"
    wget -q --show-progress -O $project.zip $1/archive/master.zip
    if [ ! -f $project.zip ]; then
        echo Project \'$project\' not find...
        cd ..
        rm -rd download
        exit 1
    fi
    unzip -q $project.zip
    rm $project.zip
    mv $(ls) ../experiments/$project
    cd ..
    rm -d download
fi

echo Anlysing project: $project

cd app
npm run --silent build
if [ "$2" = "-http" ]; then
  if [ ! -z "$3" ]; then
    HTTP_PATH=$3
  else
    echo "HTTP_PATH missing. You need to specify one with the following syntax : './run.sh <githuburl> -http HTTP_PATH'."
    echo "The result will be send to the varicity-backend."
    HTTP_PATH="http://varicitybackend:3000/projects"
  fi
  PROJECT_PATH=$path node lib/index.js -http "$HTTP_PATH"
else
  echo "The result with be written locally in '$(pwd)/export/db.json' and in '$(pwd)/export/db_link.json'."
  PROJECT_PATH=$path node lib/index.js
fi

#PROJECT_PATH=$path node lib/index.js -http http://varicitybackend:3000/projects
#PROJECT_PATH=$path HTTP_PATH=http://varicitybackend:3000/projects node lib/index.js