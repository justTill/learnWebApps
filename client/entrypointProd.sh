#!/bin/bash

ROOT_DIR=/usr/src/app/client

echo "Replacing env constants in JS"
for file in $ROOT_DIR/src/envVariables.js;
do
  echo "Processing $file ...";
  echo ${BACKENDHOST}
  echo ${BACKENDPORT}
  sed -i 's|BACKENDHOST|'${BACKENDHOST}'|g' $file
  sed -i 's|BACKENDPORT|'${BACKENDPORT}'|g' $file

done

npm run build

exec "$@"