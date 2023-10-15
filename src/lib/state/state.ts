export class State {
  public readState<TVal>(key: string, defaultValue: TVal): TVal {
    let current = this.read<TVal>(key);

    if (current === undefined) {
      current = defaultValue;

      this.write(key, current);
    }

    return current;
  }

  public writeState<TVal>(key: string, value: TVal): void {
    this.write(key, value);
  }

  public removeState(key: string): void {
    const current = JSON.parse(localStorage.getItem('state') ?? '{}') as Record<string, unknown>;

    delete current[key];

    localStorage.setItem('state', JSON.stringify(current));
  }

  public emptyState(): void {
    localStorage.removeItem('state');
  }

  private read<TVal>(key: string): TVal | undefined {
    const current = JSON.parse(localStorage.getItem('state') ?? '{}') as Record<string, unknown>;
    const item = current[key];

    if (!item) {
      return undefined;
    }

    return item as TVal;
  }

  private write<TVal>(key: string, value: TVal): void {
    const current = JSON.parse(localStorage.getItem('state') ?? '{}') as Record<string, unknown>;

    current[key] = value;

    localStorage.setItem('state', JSON.stringify(current));
  }
}
