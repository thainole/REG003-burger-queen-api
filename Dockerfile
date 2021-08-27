# syntax=docker/dockerfile:1

FROM node:14.17.4
ENV NODE_ENV=production

WORKDIR /REG003-burger-queen-api

COPY . .

RUN npm install --production

COPY . .

CMD [ "node", "/REG003-burger-queen-api/index.js" ]