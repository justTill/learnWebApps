#!/bin/bash

ROOT_DIR=/usr/src/app/client

echo "Replacing env constants in JS"
for file in $ROOT_DIR/src/envVariables.js;
do
  echo "Processing $file ...";
  echo ${BACKENDURL}
  sed -i 's|BACKENDURL|'${BACKENDURL}'|g' $file

done

npm run serve

exec "$@"