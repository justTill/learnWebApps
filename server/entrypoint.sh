#!/bin/bash

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done
    echo "PostgreSQL started"
fi
node liquibase.js
npm run dev-nodemon
#yarn node-liquibase --changeLogFile="./changelog.json" --url="jdbc:postgresql://localhost:5432/learnWebApps" --username="webAdmin" --password="defaultPasswort" --classpath=postgresql-42.2.20.jar update

exec "$@"