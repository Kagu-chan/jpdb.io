export class UserSettingsPersistence {
  public getModuleOption<T>(module: string, key: string, defaultValue: T): T {
    return this.read<Record<string, T>>(module, { [key]: defaultValue })[key];
  }

  public setModuleOption<T>(module: string, key: string, value: T): void {
    const data = this.read<Record<string, T>>(module, {});

    data[key] = value;
    this.write(module, data);
  }

  public read<TResult>(key: string, defaultValue: TResult): TResult {
    if (!localStorage.getItem(key)) {
      this.write(key, defaultValue);
    }

    return JSON.parse(localStorage.getItem(key)) as TResult;
  }

  public write<TData>(key: string, value: TData): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
