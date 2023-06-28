import { TranscriberService } from "../src/services/transcriber.service.ts";
import { SpeechToTextHandler } from "../src/usesCases/speechToText.ts";
import { CacheInMemory } from "../src/utils/Cache.ts";
import { TaskQueue } from "../src/utils/TaskQueue.ts";
import blobToUint8Array from "../src/utils/blobToUint8Array.ts";

import { loadSync } from "https://deno.land/std@0.192.0/dotenv/mod.ts";

import { assertEquals } from "assert";

function buildSpeechToText() {
  const env = loadSync();
  const apiKey = env["OPENAI_API_KEY"];
  const transcriberService = new TranscriberService(apiKey);
  const taskQueue = new TaskQueue<string>(5);
  const cache = new CacheInMemory();

  const speechToTextHandler = new SpeechToTextHandler(
    transcriberService,
    cache,
    taskQueue
  );
  return speechToTextHandler;
}
Deno.test(
  "Must return the video transcription",
  {
    permissions: {
      net: true,
      env: true,
      read: true,
    },
  },
  async () => {
    const text = "Ah shit, here we go again.";

    const video = await Deno.readFile("videoplayback.mp4");
    const handler = buildSpeechToText();
    const blob = await blobToUint8Array(video);

    const transcription = await handler.handle({ data: blob });

    assertEquals(text, transcription);
  }
);
