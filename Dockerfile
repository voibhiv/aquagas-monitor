FROM node:20.15.0-alpine3.20

WORKDIR /usr/app

COPY package*.json ./
COPY .env ./
RUN yarn

COPY . .

EXPOSE 3000
CMD yarn start