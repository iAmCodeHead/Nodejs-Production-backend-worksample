# development stage
FROM node:14-alpine as base

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ecosystem.config.json ./

COPY . .

RUN ls -a

RUN yarn install --pure-lockfile && yarn compile

