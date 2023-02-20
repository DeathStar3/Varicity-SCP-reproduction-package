if [ -f ./import.base.csv ]; then
  docker exec -u neo4j symfinderts_neo4j neo4j-admin import --multiline-fields=true --nodes=/import/base.csv
fi
