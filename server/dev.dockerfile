FROM node:alpine

WORKDIR /app

RUN echo 'forced install packages 1'
COPY package.json .
RUN npm install

CMD ["npm", "run", "nodemon"]
