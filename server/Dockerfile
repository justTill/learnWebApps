FROM node:15

RUN apt-get update && apt-get install -y openjdk-8-jdk netcat

WORKDIR /usr/src/app/server

COPY package*.json ./
COPY liquibase/changelog.json ./
COPY liquibase/sessionTable.sql  ./
COPY liquibase.js ./
COPY ./entrypoint.sh ./
COPY . ./

RUN chmod 777 ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
RUN npm install nodemon
RUN npm install

EXPOSE 3080

ENTRYPOINT ["/usr/src/app/server/entrypoint.sh"]
#CMD ["npm", "run", "dev"]