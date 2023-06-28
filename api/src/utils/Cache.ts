export type CacheEntry = {
  value: unknown;
  expiry: number;
};

export interface Cache {
  get<T = unknown>(key: string): T | undefined;
  set(key: string, value: unknown, expiry: number): void;
  delete(key: string): void;
}

export class CacheInMemory implements Cache {
  private readonly cache: Map<string, CacheEntry> = new Map();
  private readonly timers: Map<string, number> = new Map();

  get<T>(key: string) {
    const entry = this.cache.get(key);

    if (!entry) return;

    this.extendCacheLifeTime(key, entry.expiry);

    return entry.value as T;
  }

  set(key: string, value: unknown, expiry: number) {
    this.cache.set(key, { value, expiry });
    this.setCacheLifeTime(key, expiry);
  }

  delete(key: string) {
    this.cache.delete(key);
    this.clearCacheLifeTime(key);
  }

  private setCacheLifeTime(key: string, expiry: number) {
    const timer = setTimeout(() => this.cache.delete(key), expiry);
    this.timers.set(key, timer);
  }

  private extendCacheLifeTime(key: string, expiry: number) {
    const timer = this.timers.get(key);
    if (!timer) return;

    clearTimeout(timer);
    this.setCacheLifeTime(key, expiry);
  }

  private clearCacheLifeTime(key: string) {
    const timer = this.timers.get(key);
    if (!timer) return;

    clearTimeout(timer);
    this.timers.delete(key);
  }
}
