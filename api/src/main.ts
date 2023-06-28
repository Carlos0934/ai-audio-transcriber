import { serve } from "https://deno.land/std@0.167.0/http/server.ts";
import "https://deno.land/std@0.192.0/dotenv/load.ts";
import { Hono } from "hono";
import transcriberRouter from "./routes/transcribe.ts";

const app = new Hono();
app.use("*", (ctx, next) => {
  ctx.res.headers.set("Access-Control-Allow-Origin", "*");
  ctx.res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  ctx.res.headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  ctx.res.headers.set("Access-Control-Allow-Credentials", "true");
  return next();
});
app.route("/", transcriberRouter);
serve(app.fetch);
