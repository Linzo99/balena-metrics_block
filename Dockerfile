FROM balenalib/%%BALENA_MACHINE_NAME%%-debian-node:16-buster-run

WORKDIR /usr/src/app

# install node dependencies
COPY package.json  .
RUN JOBS=MAX npm install --unsafe-perm --production && npm cache clean --force

COPY . .

CMD ["npm", "start"]
