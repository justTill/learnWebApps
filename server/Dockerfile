FROM node:12

RUN apt-get update && apt-get install -y openjdk-8-jdk netcat

WORKDIR /usr/src/app/server

COPY package*.json ./
COPY liquibase/changelog.json ./
COPY liquibase/sesstionTable.sql ./
COPY liquibase.js ./
COPY entrypoint.sh ./

RUN npm install

EXPOSE 3080

ENTRYPOINT ["./entrypoint.sh"]
#CMD ["npm", "run", "dev"]