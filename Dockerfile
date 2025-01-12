FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

COPY .env .env

ENV PORT=3000

EXPOSE $PORT

CMD ["node", "server.js"]
