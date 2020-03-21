FROM node

WORKDIR /usr/app

COPY gif/ gif/
COPY img/ img/ 
COPY locales/ locales/ 

COPY dist/ dist/
COPY package.json .
COPY tsconfig.json .
COPY .env .

RUN [ "npm", "install" ]
ENTRYPOINT [ "npm", "start" ]
