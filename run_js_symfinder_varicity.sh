#!/bin/bash
#######################################################################################################
usage() {
  echo
  echo "Usage ./run_js_symfinder_varicity.sh PATH_TO_PROJECT NAME_JSON_FILE"
  echo
  echo "ARGUMENTS : "
  echo "PATH_TO_PROJECT should be a local path (absolute or relative) or a link of a git repository."
  echo "NAME_JSON_FILE should be a string composed of only letter, number, and underscore."
  echo
}
#######################################################################################################

ABSOLUTE_PATH=$(pwd)
DATA_PATH="$ABSOLUTE_PATH/dockervolume/data/symfinder_files"
MANUAL_PATH="$ABSOLUTE_PATH/dockervolume/manual/symfinder_files"
PROJECT_NAME=$2
JSON_FILE="$PROJECT_NAME.json"
PATH_TO_SYMFINDER_JS_APP="$ABSOLUTE_PATH/js/app"
VARICITY_CONFIG_FILE="$ABSOLUTE_PATH/dockervolume/varicitydb.json"

#if [[ "$1" = "-h"  ||  "$1" = "--help" || -z "$1" || -z "$2" ]]
#then
#  usage
#  exit
#fi
#
cd $ABSOLUTE_PATH/js
#echo "1. ANALYSE WITH SYMFINDER JS -->"
#
#echo "Analysing project with link $1 :"
#echo
#./run.sh $1
#echo "END OF THE ANALYSE."
#
#echo "2. PREPARE VARICITY ENVIRONMENT -->"
#if [ ! -d "$DATA_PATH" ]
#then
#  echo "Creating directories for the varicity json ${DATA_PATH}..."
#  mkdir -p $DATA_PATH
#  echo "${DATA_PATH} created."
#  echo
#  echo "Creating directories for the varicity json ${MANUAL_PATH}..."
#  mkdir -p MANUAL_PATH
#  echo "${MANUAL_PATH} created."
#fi

echo "Moving the $PATH_TO_SYMFINDER_JS_APP/db.json to $DATA_PATH/$JSON_FILE and $MANUAL_PATH/$JSON_FILE :"
cp "$PATH_TO_SYMFINDER_JS_APP/db.json" "$DATA_PATH/$JSON_FILE"
cp "$PATH_TO_SYMFINDER_JS_APP/db.json" "$MANUAL_PATH/$JSON_FILE"

if [ -f "$VARICITY_CONFIG_FILE" ]
then
  echo "File $VARICITY_CONFIG_FILE exists..."
  if grep -q 'projects' "$VARICITY_CONFIG_FILE"
  then
    echo "Adding new projects to existing..."
    TEXT_TO_ADD="    ,{\n      \"path\": \"\/persistent\/data\/symfinder_files\/$JSON_FILE\",\n      \"projectName\": \"$PROJECT_NAME\"\n    }\n"
    sed -i "/]/i $TEXT_TO_ADD" "$VARICITY_CONFIG_FILE"
  else
    echo "Creating projects and adding this one..."
    TEXT_TO_ADD="\n  \"projects\": [\n     {\n      \"path\": \"/persistent/data/symfinder_files/$JSON_FILE\",\n      \"projectName\": \"$PROJECT_NAME\"\n    }\n  ]\n"
    if grep -q '{}' "$VARICITY_CONFIG_FILE"
    then
      sed "s/{*}/{$TEXT_TO_ADD}\n/" "$VARICITY_CONFIG_FILE"
    else
      # shellcheck disable=SC2059
      printf "{$TEXT_TO_ADD}" > "$VARICITY_CONFIG_FILE"
    fi
  fi
else
  echo "File $VARICITY_CONFIG_FILE doesn't exist. Creating..."
  TEXT_TO_ADD="{\n    \"projects\": [\n      {\n        \"path\": \"/persistent/data/symfinder_files/$JSON_FILE\",\n        \"projectName\": \"$PROJECT_NAME\"\n      }\n    ]\n}\n"
  # shellcheck disable=SC2059
  printf "$TEXT_TO_ADD" > "$VARICITY_CONFIG_FILE"
fi
cat "$VARICITY_CONFIG_FILE"