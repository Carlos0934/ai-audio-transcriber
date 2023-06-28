import { Hono } from "hono";
import { TranscriberService } from "../services/transcriber.service.ts";
import { CacheInMemory } from "../utils/Cache.ts";
import { TaskQueue } from "../utils/TaskQueue.ts";
import { SpeechToTextHandler } from "../usesCases/speechToText.ts";

const transcriberRouter = new Hono();
const apiKey = Deno.env.get("OPENAI_API_KEY");
if (!apiKey) throw new Error("OPENAI_API_KEY is not defined");
const transcriberService = new TranscriberService(apiKey);
const taskQueue = new TaskQueue<string>(2);
const cache = new CacheInMemory();

const speechToTextHandler = new SpeechToTextHandler(
  transcriberService,
  cache,
  taskQueue
);

transcriberRouter.post("/transcribe", async (c) => {
  const body = c.req.body;
  const data = await c.req.blob();
  const signal = c.req.signal;

  if (!body || data.size === 0 || !data) {
    return c.text("No body", 400);
  }

  const result = await speechToTextHandler.handle({
    data,
    signal,
  });

  return c.text(result);
});

export default transcriberRouter;
