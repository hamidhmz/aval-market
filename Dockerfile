FROM node
WORKDIR /app
CMD ["sh","-c"," npm install && npm start"]