FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

EXPOSE 4000

CMD ["npm", "start"]