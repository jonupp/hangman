FROM node

WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV NODE_ENV=production
CMD ["node", "-r", "dotenv/config", "bin/www.js", "dotenv_config_path=.env.production"]