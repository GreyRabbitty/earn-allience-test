FROM node:18.17.1-bullseye-slim as build-deps
WORKDIR /root/build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

FROM build-deps as builder
WORKDIR /root/build
COPY tsconfig.build.json tsconfig.json nest-cli.json ./
COPY ./scripts ./scripts
COPY ./apps ./apps
COPY ./libs ./libs
RUN sh scripts/build-all.sh

FROM node:18.17.1-bullseye-slim as app-deps
WORKDIR /root/build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

FROM build-deps as app-builder
ARG APP
WORKDIR /root/build
COPY tsconfig.build.json tsconfig.json nest-cli.json ./
COPY ./scripts ./scripts
COPY ./apps ./apps
COPY ./libs ./libs
RUN sh scripts/build.sh $APP

FROM node:18.17.1-bullseye-slim as app
WORKDIR /
ARG APP
COPY --from=app-deps /root/build/node_modules ./node_modules
COPY --from=app-builder /root/build/dist/apps/$APP ./dist
WORKDIR /dist/apps/$APP/src
ENTRYPOINT [ "node", "./main.js" ]
