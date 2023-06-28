interface TranscriberOptions {
  signal?: AbortSignal;
}
export class TranscriberService {
  constructor(private readonly API_KEY: string) {}

  private static readonly API_URL =
    "https://api.openai.com/v1/audio/transcriptions";

  transcriber(blob: Blob, options?: TranscriberOptions) {
    return this.#transcriber(blob, options?.signal);
  }

  async #transcriber(blob: Blob, signal?: AbortSignal) {
    const formData = new FormData();

    formData.append("file", blob, "audio.mp4");
    formData.append("model", "whisper-1");

    const res = await fetch(TranscriberService.API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
        ContentType: "multipart/form-data",
      },
      signal,
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(text);
      throw new Error("Failed to transcriber");
    }

    const data = await res.json();

    return data.text as string;
  }
}
