export class ImageThumbnailCache {
  private cache = new Map<string, string>();
  private pending = new Map<string, Promise<string>>();

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, url: string): void {
    this.cache.set(key, url);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.cache.clear();
    this.pending.clear();
  }

  async getOrGenerate(
    key: string,
    generator: () => Promise<string>
  ): Promise<string> {
    const cached = this.cache.get(key);
    if (cached) return cached;

    if (this.pending.has(key)) {
      return this.pending.get(key)!;
    }

    const promise = generator()
      .then((url) => {
        this.cache.set(key, url);
        this.pending.delete(key);
        return url;
      })
      .catch((err) => {
        this.pending.delete(key);
        throw err;
      });

    this.pending.set(key, promise);
    return promise;
  }
}

export const thumbnailCache = new ImageThumbnailCache();
