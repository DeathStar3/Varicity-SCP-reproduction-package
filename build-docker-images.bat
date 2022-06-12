
@echo off
cd symfinder
docker build -f Dockerfile -t deathstar3/symfinder-cli:local .
cd ../varicity
echo "Building the front"
docker build -t deathstar3/varimetrics:local .

cd ../varicity-backend
echo "Building the backend"
docker build -t deathstar3/varimetrics-backend:local .

echo "Done"
