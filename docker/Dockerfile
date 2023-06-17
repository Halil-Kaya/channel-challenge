FROM alpine
WORKDIR project
COPY ../. .

RUN apk update && apk add bash
RUN apk add --update nodejs npm

RUN chmod -R 0777 ./docker/init.sh

RUN npm install