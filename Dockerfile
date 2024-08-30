FROM node:20.15.0

WORKDIR /usr/app

COPY package*.json ./
COPY .env ./
RUN yarn install

COPY . .

RUN chmod +x /usr/app/wait-for-it.sh
RUN npx prisma generate

EXPOSE 3000
CMD yarn start