project_tested="$1"


echo "Running test for: $project_tested"

cd app
npm run --silent build

PROJECT_PATH=$project_tested node lib/index.js

echo "Go check the result on port 7474"
echo "Corresponding database has been downloaded into db.json"

echo "running test ..."

npm t 
