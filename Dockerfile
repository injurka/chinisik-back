FROM denoland/deno:alpine

WORKDIR /opt/app

COPY . .

RUN deno lint
RUN deno check ./src/main.ts
RUN deno install --allow-scripts --entrypoint ./src/main.ts

CMD [ "deno", "run", "--allow-all", "./src/main.ts" ]
