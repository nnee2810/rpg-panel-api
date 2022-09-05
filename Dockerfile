# build stage
FROM node:18.7-alpine AS build

WORKDIR /app

COPY package*.json .

RUN yarn

COPY . .

RUN yarn build

# production stage
FROM node:18.7-alpine

WORKDIR /app

COPY --from=build /app/node_modules /node_modules
COPY --from=build /app/dist /dist
COPY /ssl /ssl
COPY .prod.env package.json /

CMD ["yarn", "start:prod"]