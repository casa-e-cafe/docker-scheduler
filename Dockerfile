FROM node:8.2.1-alpine
RUN mkdir -p /usr/src/cron; \
apk add --no-cache bash; \
apk add --no-cache coreutils; \
apk add --no-cache docker; \
apk add --no-cache curl; \
apk add --no-cache openssh-client

WORKDIR /usr/src/cron

COPY . /usr/src/cron/

RUN ["/bin/bash", "setup-cron.sh"]

VOLUME /var/run/docker.sock:/var/run/docker.sock

WORKDIR /usr/src/cron/server

RUN npm install && npm cache clean --force

EXPOSE 3000

CMD ["/bin/bash", "../run.sh"]
