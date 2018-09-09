FROM node:10

# Create app directory

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
RUN npm install nodemon -g

#Bundle app source
COPY . .

# Expose port 3006
EXPOSE 3006
CMD ["npm", "install", "nodemon", "-g"]
CMD [ "npm", "run", "dev" ]
