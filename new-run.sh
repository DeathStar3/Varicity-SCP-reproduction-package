

set -e

docker run --detach --name varicityneo4j --publish=7474:7474 --publish=7687:7687 --rm -e NEO4J_AUTH=none  deathstar3/symfinder-neo4j:vissoft2021

#wait-for-it -t 0 localhost:7474
# la commande commentée si haut est utile pour attendre complètement que la base de donnée soit prête
# mais si la commande n'est pas disponible , ignorer la : Symfinder attendra de toute façon que Neo4j soit prêt



docker run --detach --rm  --publish 9090:9090 deathstar3/varicity:local

docker run --detach --rm  --publish 3000:3000 deathstar3/varicity-backend:local


java -jar  symfinder-service/target/quarkus-app/quarkus-run.jar

