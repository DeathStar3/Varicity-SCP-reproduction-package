project_tested="$1"
path=unit_tests/$project_tested

echo "Running test for: $project_tested"

cd app
npm run --silent build

PROJECT_PATH=$path node lib/index.js

echo "Go check the result on port 7474"
echo "Corresponding database has been downloaded into $1_db.json"

cd ..

echo "running test ..."

npm run test 

echo "running coverage ..."

npm run coverage