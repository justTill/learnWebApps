FROM node:15

WORKDIR /usr/src/app/client

COPY package.json ./
COPY package-lock.json ./
COPY ./src ./

RUN npm install


EXPOSE 8080

CMD ["npm", "run", "serve"]