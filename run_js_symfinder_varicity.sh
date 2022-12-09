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

DATA_PATH='dockervolume/data/symfinder_files'
MANUAL_PATH='dockervolume/manual/symfinder_files'
JSON_FILE="$2.json"
PATH_TO_SYMFINDER_JS_APP='app'

if [[ "$1" = "-h"  ||  "$1" = "--help" || -z "$1" || -z "$2" ]]
then
  usage
  exit
fi

cd js
echo "1. ANALYSE WITH SYMFINDER JS -->"
echo "Analysing project with link $1 :"
echo
./run.sh $1

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

echo "Moving the $PATH_TO_SYMFINDER_JS_APP/db.json to $DATA_PATH/$JSON_FILE and $MANUAL_PATH/$JSON_FILE :"
cp "$PATH_TO_SYMFINDER_JS_APP/db.json" "$DATA_PATH/$JSON_FILE"
cp "$PATH_TO_SYMFINDER_JS_APP/db.json" "$MANUAL_PATH/$JSON_FILE"
echo "END OF THE ANALYSE."

echo "2. DISPLAY IN VARICITY -->"