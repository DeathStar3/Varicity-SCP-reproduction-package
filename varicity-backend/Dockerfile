FROM node:16-alpine AS builder
WORKDIR /app

COPY ./package.json ./
RUN ls
RUN npm install
COPY . .
RUN ls
RUN npm run build
RUN ls

FROM node:16-alpine
WORKDIR /app
RUN ls
COPY --from=builder /app ./
RUN ls
CMD ["npm", "run", "start:prod"]
