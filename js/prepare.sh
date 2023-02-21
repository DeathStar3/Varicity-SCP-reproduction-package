if [ ! -d experiments ]; then
    mkdir experiments
fi

if [ ! -d ./app/export ]; then
    mkdir ./app/export
fi

if ! docker ps | grep -q neo4j; then
    echo Starting docker
    ./start_neo4j.sh
fi
cd app
npm install
