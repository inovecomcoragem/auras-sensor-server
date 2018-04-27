FROM node:8-stretch

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/server && cp -a /tmp/node_modules /opt/server/

WORKDIR /opt/server
ADD package.json /opt/server/
ADD .env /opt/server/
ADD index.js /opt/server/

CMD ["npm", "run", "start"]
