@echo off

SET COMPOSE_CONVERT_WINDOWS_PATHS=1
set SYMFINDER_UID=1000
set SYMFINDER_GID=1000
set SYMFINDER_VERSION=$(git rev-parse HEAD)
set TAG=local
set DIR_PATH=%cd%
set VOLUME_PATH=%cd%\dockervolume

if not exist  "resources\NUL" mkdir resources
if not exist "data\NUL" mkdir data
if not exist "dockervolume\NUL" mkdir dockervolume

docker network ls | findstr varicity-config > NUL || docker network create --driver bridge varicity-config

docker-compose -f varicity-front-back.docker-compose.yaml up

