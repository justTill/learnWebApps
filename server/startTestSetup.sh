#!/bin/bash
export DB_PASSWORD="test_password"
export DB_CONTAINER_NAME="test_database"
export SQL_HOST="localhost"
export DB_USER="test_user"
export SQL_PORT=5555
export DB_NAME="test_database"

docker run --name test_database -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_USER=$DB_USER -e POSTGRES_DB=$DB_NAME -p $SQL_PORT:5432 -d postgres:11.0-alpine

echo "Waiting for postgres..."

while ! nc -z $SQL_HOST $SQL_PORT; do
  sleep 0.1
done
echo "PostgreSQL started"
sleep 2

yarn node-liquibase --changeLogFile="./liquibase/changelog.json" --url="jdbc:postgresql://$SQL_HOST:$SQL_PORT/test_database" --username="test_user" --password="test_password" --classpath=./node_modules/liquibase-wrapper/lib/postgres/postgresql-42.2.18.jar update

node spec/support/testData.js

sleep 2
jasmine || status=$?
docker rm -f $(docker ps -a -q --filter="name=$DB_CONTAINER_NAME")
exit $status
