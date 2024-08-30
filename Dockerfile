FROM node:20.15.0

WORKDIR /usr/app

COPY package*.json ./
COPY .env ./
RUN yarn

COPY . .

RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 3000
CMD yarn start