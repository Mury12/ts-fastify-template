FROM node:16.15.1

WORKDIR /app

COPY . .

# RUN git submodule init && git submodule update

RUN yarn add ts-node typescript
RUN yarn install

EXPOSE 3001
