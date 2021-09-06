#!/bin/sh

echo "Replacing env constants in JS"
for file in /usr/share/nginx/html/js/*.js;
do
  echo "Processing $file ...";
  echo ${BACKENDURL}
  sed -i 's|BACKENDURL|'${BACKENDURL}'|g' $file

done

exec "$@"