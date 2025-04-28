FROM node:20.10.0-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --no-cache


COPY ./ ./

EXPOSE 3000

ARG NODE_ENV_DOCKER
ENV NODE_ENV_DOCKER=${NODE_ENV_DOCKER}

CMD  echo $NODE_ENV_DOCKER; NODE_ENV=$NODE_ENV_DOCKER npm run dev;
