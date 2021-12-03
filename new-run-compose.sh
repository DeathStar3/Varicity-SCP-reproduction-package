
set -e

#wait-for-it -t 0 localhost:7474
# la commande commentée si haut est utile pour attendre complètement que la base de donnée soit prête
# mais si la commande n'est pas disponible , ignorer la : Symfinder attendra de toute façon que Neo4j soit prêt

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

create_directory resources

create_directory data

docker-compose -f new-symfinder-compose.yaml up

