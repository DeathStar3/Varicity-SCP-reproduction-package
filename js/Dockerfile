FROM node:16.20-alpine

WORKDIR /usr/symfinder_ts/

COPY ./app/package*.json .
RUN npm install

# Bundle app source
COPY ./app/src ./app/src
COPY ./app/babel.config.js ./app/
COPY ./app/neo4j.yaml ./app/
COPY ./app/tsconfig.json ./app

COPY ./experiments/echarts ./experiments/echarts

COPY ./start.sh ./start.sh

RUN chmod +x ./start.sh

RUN npm run build

ENTRYPOINT ["/bin/sh", "./start.sh"]