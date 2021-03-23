FROM node:15-alpine

ENV NODE_ENV=production

WORKDIR /app

#Copy dependencies
COPY package*.json ./

RUN npm install --production

COPY . .

CMD [ "npm", "start" ]