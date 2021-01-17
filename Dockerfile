FROM node:15

# Create app directory
WORKDIR /usr/src/ui

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install serve -g
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm run build
EXPOSE 5000
CMD [ "serve", "-s","build" ]