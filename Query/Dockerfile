FROM node:10

# Create app directory

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
RUN npm install nodemon -g

#Bundle app source
COPY . .

# Expose port 3000
EXPOSE 3000
CMD ["npm", "install", "nodemon", "-g"]
CMD [ "npm", "run", "dev" ]
