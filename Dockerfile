FROM node

WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV NODE_ENV=release
CMD ["node", "bin/www.js"]