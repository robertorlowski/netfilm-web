FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm run build

COPY server.key /usr/src/app/dist
COPY server.cert /usr/src/app/dist

EXPOSE 9000
EXPOSE 9001

CMD [ "node", "/usr/src/app/dist/server.js" ]
