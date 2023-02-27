project=$(basename -- $1)
path=experiments/$project

if [ ! -d $path ]; then
    echo Download at $1
    mkdir download
    cd download
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

echo Anlysing base project: $project

cd app
npm run --silent build

PROJECT_PATH=$path node --max-old-space-size=8192 lib/index.js -b

docker exec -u neo4j symfinderts_neo4j /bin/bash -c 'cat /import/export_procedure | cypher-shell -u neo4j -p root --format plain'
sed -E -i 's/:([A-Z]*)/;\1/g' ./import/base.csv
sed -E -i 's/^"([0-9]+)","(;)([^"]*)"/\"\1","\3"/g' ./import/base.csv
sed -i '1 c"id:ID","_labels:LABEL","name","path","_start","_end","_type"' ./import/base.csv
