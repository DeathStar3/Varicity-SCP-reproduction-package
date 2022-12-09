#!/bin/bash
usage() {
  echo
  echo "Usage ./run_js_symfinder_varicity.sh PATH_TO_PROJECT"
  echo
  echo "ARGUMENTS : "
  echo "PATH_TO_PROJECT should be a local path (absolute or relative) or a link of a git repository."
  echo
}

if [[ "$1" = "-h"  ||  "$1" = "--help" || -z "$1" ]]; then
  usage;
  exit;
fi

cd js
echo "1. ANALYSE WITH SYMFINDER JS -->"
echo "Analysing project with link $1 :"
echo
./run.sh $1

mv app\db.json

echo "END OF THE ANALYSE."

echo "2. DISPLAY IN VARICITY -->"