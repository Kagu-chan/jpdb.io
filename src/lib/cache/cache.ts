export class Cache {
  public fromCache<TVal>(
    moduleKey: string,
    key: string,
    ttl: number,
    retrieveFn: () => TVal,
  ): TVal {
    let current = this.read<TVal>(moduleKey, key);

    if (current === undefined) {
      current = retrieveFn();

      this.write(moduleKey, key, ttl, current);
    }

    return current;
  }

  public async fromCacheAsync<TVal>(
    moduleKey: string,
    key: string,
    ttl: number,
    retrieveFn: () => Promise<TVal>,
  ): Promise<TVal> {
    const current = this.read<TVal>(moduleKey, key);

    if (current) return Promise.resolve(current);

    const val = await retrieveFn();
    this.write(moduleKey, key, ttl, val);

    return val;
  }

  public invalidate(moduleKey: string, key: string): void {
    const k = `${moduleKey}-${key}`;
    const current = JSON.parse(localStorage.getItem('cache') ?? '{}') as Record<
      string,
      { exp: number; value: unknown }
    >;

    if (current[k]) {
      delete current[k];

      localStorage.setItem('cache', JSON.stringify(current));
    }
  }

  private read<TVal>(moduleKey: string, key: string): TVal | undefined {
    const current = JSON.parse(localStorage.getItem('cache') ?? '{}') as Record<
      string,
      { exp: number; value: unknown }
    >;
    const item = current[`${moduleKey}-${key}`];
    const now = new Date();

    if (!item || item.exp < now.getTime()) return undefined;

    return item.value as TVal;
  }

  private write<TVal>(moduleKey: string, key: string, ttl: number, value: TVal): void {
    const current = JSON.parse(localStorage.getItem('cache') ?? '{}') as Record<
      string,
      { exp: number; value: unknown }
    >;
    const now = new Date();

    now.setTime(now.getTime() + ttl * 60 * 1000);
    current[`${moduleKey}-${key}`] = {
      exp: now.getTime(),
      value,
    };

    localStorage.setItem('cache', JSON.stringify(current));
  }
}
