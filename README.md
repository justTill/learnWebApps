# Learn Web-Apps
Application for the students of the university of applied science in Düsseldorf (HSD)
that takes the course "Web-Apps".

## What
Students should be able to complete programming lessons and assessments, that the lecturer hat entered via a special admin area

## Technologies
Application is dockerized.
### Backend
Node Server (with Express)

### Frontend
Vue application

## Build and run locally
create an env file in root directory

``` touch .env```

add environment variable that is needed
 
``` echo DB_CONTAINER_NAME=XXXX> .env```
 
to start docker setup run following command

``` docker-compose up --build ```

Our frontend can be accessed via: http://localhost:8080

Backend is accessible via http://localhost:3080

## Production environment with local changes
If you want to run your production environment with your locally code changes you need to run following commands

Take down old volume

``` docker-compose down -v```

create an env file in root directory ``` touch .env.prod```
following Variables need to be defined: DB_CONTAINER_NAME SQL_USER SQL_PW DATABASE_NAME

Build Images

 ```docker-compose -f docker-compose-prod.yml --env-file=./.env.prod up --build```

Our frontend can be accessed via: http://localhost:8080

Backend is accessible via http://localhost:3080

###create and Admin
docker-compose exec node-server node createAdmin.js 
## Licences
To be determined


