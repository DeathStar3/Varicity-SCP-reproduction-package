FROM node:14.14-alpine AS build_env

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

#copy exactly what we need

COPY public public
COPY src src
COPY tests tests
COPY tsconfig.json ./
COPY webpack.config.js .

RUN npm run build

FROM nginx:1.20-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build_env  /usr/src/app/dist/* ./

