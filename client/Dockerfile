FROM node:12

WORKDIR /usr/src/app/client

COPY package.json ./
COPY package-lock.json ./

RUN npm install


EXPOSE 8080

CMD ["npm", "run", "serve"]