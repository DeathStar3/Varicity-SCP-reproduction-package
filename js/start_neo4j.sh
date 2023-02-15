if ! docker  ps -a | grep -q symfinderts_neo4j; then
  echo "Starting Docker"
  docker run --name symfinderts_neo4j -d -p7474:7474 -p7687:7687 -e NEO4J_AUTH=neo4j/root \
  -e NEO4JLABS_PLUGINS='["apoc"]' \
  --volume $(pwd)/conf:/conf \
  --volume $(pwd)/import:/import \
  neo4j:4.1.9
  echo "Import base"
  ./import_base.sh > /dev/null
elif ! docker ps | grep -q symfinderts_neo4j; then
  echo "Restarting Docker"
  docker restart symfinderts_neo4j
fi
