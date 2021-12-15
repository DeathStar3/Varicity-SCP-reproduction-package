
set -e

create_directory(){
    if [[ ! -d "$1" ]]; then
        echo "Creating $1 directory"
        mkdir "$1"
    else
        echo "$1 directory already exists"
    fi
}

export SYMFINDER_UID=$(id -u)
export SYMFINDER_GID=$(id -g)
export SYMFINDER_VERSION=$(git rev-parse HEAD)
export TAG=local
export DIR_PATH=$(pwd)
export VOLUME_PATH=$(pwd)/dockervolume

create_directory resources
create_directory data
create_directory dockervolume

docker network ls | grep varicity-config > /dev/null || docker network create --driver bridge varicity-config

docker-compose -f varicity-front-back.docker-compose.yaml up --detach

