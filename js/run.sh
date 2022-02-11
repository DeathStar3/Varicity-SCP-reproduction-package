if ! docker ps | grep -q neo4j; then
    echo Starting docker
    docker run -d -p7474:7474 -p7687:7687 -e NEO4J_AUTH=neo4j/root neo4j
fi
project=$(basename -- $1)
path=experiments/$project

if [ ! -d $path ]; then
    echo Download 
    mkdir download
    cd download
    wget -q -O $project.zip $1/archive/master.zip
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

PROJECT_PATH=$path node lib/index.js
