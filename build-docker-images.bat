
@echo off
cd symfinder
docker build -f Dockerfile -t deathstar3/symfinder-cli:local .
cd ../varicity
echo "Building the front"
docker build -t deathstar3/varicity:local .

cd ../varicity-backend
echo "Building the backend"
docker build -t deathstar3/varicity-backend:local .

echo "Done"
