#!/bin/bash

wait-for-it -t 0 $SONARQUBE_URL

# attendre que sonarqube soit prêt

until [ $(curl --silent $SONARQUBE_URL/api/system/status | grep UP -c ) == 1 ]
do
  echo "Sonarqube is not ready"
  sleep 2
done