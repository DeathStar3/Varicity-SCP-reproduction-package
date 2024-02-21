#!/bin/bash
#######################################################################################################
usage() {
  echo
  echo "Usage ./run_varicity_ts.sh PATH_TO_PROJECT PROJECT_NAME"
  echo
  echo "ARGUMENTS : "
  echo "PATH_TO_PROJECT must be the link of a git repository."
  echo "PROJECT_NAME should be a string composed of only letter, number, and underscore."
  echo
}
#######################################################################################################

ABSOLUTE_PATH=$(pwd)
DATA_PATH="$ABSOLUTE_PATH/dockervolume/data/symfinder_files"
MANUAL_PATH="$ABSOLUTE_PATH/dockervolume/manual/symfinder_files"
PROJECT_NAME=$2
JSON_FILE="$PROJECT_NAME.json"
PATH_TO_SYMFINDER_JS_APP="$ABSOLUTE_PATH/js/app/export"
VARICITY_CONFIG_FILE="$ABSOLUTE_PATH/dockervolume/varicitydb.json"

if [[ "$1" = "-h"  ||  "$1" = "--help" || -z "$1" || -z "$2" ]]
then
  usage
  exit
fi

cd $ABSOLUTE_PATH/js
echo "1. ANALYSE WITH SYMFINDER JS -->"

echo "Analysing project with link $1 :"
echo
./run.sh $1
echo "END OF THE ANALYSE."

echo "2. PREPARE VARICITY ENVIRONMENT -->"
if [ ! -d "$DATA_PATH" ]
then
  echo "Creating directories for the varicity json ${DATA_PATH}..."
  mkdir -p $DATA_PATH
  echo "${DATA_PATH} created."
  echo
  echo "Creating directories for the varicity json ${MANUAL_PATH}..."
  mkdir -p MANUAL_PATH
  echo "${MANUAL_PATH} created."
fi

echo "Moving the $PATH_TO_SYMFINDER_JS_APP/db_link.json to $DATA_PATH/$JSON_FILE and $MANUAL_PATH/$JSON_FILE :"
cp "$PATH_TO_SYMFINDER_JS_APP/db_link.json" "$DATA_PATH/$JSON_FILE"
cp "$PATH_TO_SYMFINDER_JS_APP/db_link.json" "$MANUAL_PATH/$JSON_FILE"

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
      printf "{$TEXT_TO_ADD}" > "$VARICITY_CONFIG_FILE"
    fi
  fi
else
  echo "File $VARICITY_CONFIG_FILE doesn't exist. Creating..."
  TEXT_TO_ADD="{\n    \"projects\": [\n      {\n        \"path\": \"/persistent/data/symfinder_files/$JSON_FILE\",\n        \"projectName\": \"$PROJECT_NAME\"\n      }\n    ]\n}\n"
  printf "$TEXT_TO_ADD" > "$VARICITY_CONFIG_FILE"
fi
echo "Launching Varicity..."
cd "$ABSOLUTE_PATH"
if [ ! "$(docker container ps | grep varicity)" ]
then
  ./run-compose.sh
fi
