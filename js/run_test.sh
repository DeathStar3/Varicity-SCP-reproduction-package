project_tested="$1"
path=unit_tests/$project_tested

echo "Running test for: $project_tested"

cd app
npm run --silent build

PROJECT_PATH=$path node lib/index.js

echo "Go check the result on port 7474"

username=neo4j
password=root
query_file="$2"
command="cat $quey_file | cypher-shell -u $username -p $password --format plain"