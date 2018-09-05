FROM node:8

RUN mkdir /app

RUN chmod 755 /app

ADD ./package.json /app

ADD ./.npmrc /app

WORKDIR /app

RUN npm install

ADD ./src /app/src

ADD ./config /app/config

ENV NODE_ENV production

EXPOSE 7002

CMD ["node", "src/Main.js"]
