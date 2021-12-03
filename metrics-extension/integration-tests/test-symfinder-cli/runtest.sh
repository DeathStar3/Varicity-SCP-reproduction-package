
set -e

#test itself
bash test_integration_sonarqube_linux.sh


#after
docker container rm --force $(docker container ls -a --quiet)