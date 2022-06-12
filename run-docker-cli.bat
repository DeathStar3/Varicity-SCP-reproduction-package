@echo off

set tag=splc2022
docker network ls | findstr varicity-config > NUL || docker network create --driver bridge varicity-config
docker run -v "%cd%"\data:/data --network varicity-config -v //var/run/docker.sock:/var/run/docker.sock:ro -e RUNTIME_MODE=DOCKER  deathstar3/symfinder-cli:%tag% %*
