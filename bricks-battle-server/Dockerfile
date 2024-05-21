FROM node:22-alpine

WORKDIR /app/backend

COPY ./bricks-battle-server/package.json /app/backend
COPY ./bricks-battle-server/package-lock.json /app/backend
RUN npm install

COPY ./bricks-battle-server /app/backend

RUN mkdir -p /app/shared
COPY ./shared /app/shared

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/backend/src/main"]