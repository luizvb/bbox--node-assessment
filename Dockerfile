FROM node:12-alpine
WORKDIR /usr/src/app

# Create and go to work dir
WORKDIR /application

# Install Dependencies
RUN npm install -g ts-node
RUN npm install --quiet
# Command 
CMD ["npm", "run", "start:dev"]