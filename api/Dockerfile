FROM denoland/deno:1.34.1

WORKDIR /app

USER deno

ADD . .

RUN deno cache src/main.ts

EXPOSE 8000

CMD ["deno", "task", "start"]

