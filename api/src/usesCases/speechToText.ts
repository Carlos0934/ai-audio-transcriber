import { TranscriberService } from "../services/transcriber.service.ts";
import { Cache } from "../utils/Cache.ts";
import { TaskQueue } from "../utils/TaskQueue.ts";

interface SpeechToTextRequest {
  data: Blob;
  signal?: AbortSignal;
}

export class SpeechToTextHandler {
  constructor(
    private readonly transcriberService: TranscriberService,
    private readonly cache: Cache,
    private readonly taskQueue: TaskQueue<string>
  ) {}

  async handle(request: SpeechToTextRequest) {
    const { data, signal } = request;

    const { cachedResult, cacheKey } = await this.getCachedResult(data);

    if (cachedResult) return cachedResult;

    const result = await this.transcriber(data, signal);

    this.setCache(cacheKey, result);

    return result;
  }

  private generateCacheKey(data: SpeechToTextRequest["data"]): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const hash = reader.result?.toString().split(",")[1];

        resolve(hash || "");
      };

      reader.readAsDataURL(data);
    });
  }

  private transcriber(blob: Blob, signal?: AbortSignal) {
    const task = () => this.transcriberService.transcriber(blob, { signal });

    const promise = this.taskQueue.addTask(task);

    signal?.addEventListener("abort", () => this.taskQueue.cancelTask(task));

    return promise;
  }

  private async getCachedResult(data: Blob) {
    const cacheKey = await this.generateCacheKey(data);
    const cachedResult = this.cache.get<string>(cacheKey);

    if (cachedResult) return { cachedResult, cacheKey };

    return { cachedResult: null, cacheKey };
  }

  private setCache(cacheKey: string, result: string) {
    const expiry = 1000 * 60 * 5; // 5 minutes

    this.cache.set(cacheKey, result, expiry);
  }
}
