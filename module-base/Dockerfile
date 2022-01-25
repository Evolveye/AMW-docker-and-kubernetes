FROM node:16.13.0
WORKDIR /app

COPY . .

RUN npm install

EXPOSE 25600

RUN npx blitz build
RUN chmod +x ./cmd.sh

CMD ./cmd.sh