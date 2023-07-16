import { VERSION } from './constants';

export abstract class Root {
  public static get VERSION(): string {
    return VERSION;
  }

  public static get PATH(): string {
    return window.location.pathname;
  }

  public static get SEARCH(): string {
    return window.location.search.replace('?', '');
  }

  public static get QUERY(): Record<string, string> {
    return this.queryToObject(this.SEARCH);
  }

  public static queryToObject<T extends object>(query: string): T {
    const payload: Record<string, string> = {};

    query.split('&').forEach((c) => {
      const [key, val] = c.split('=');

      payload[key] = val;
    });

    return payload as T;
  }

  public get VERSION(): string {
    return Root.VERSION;
  }

  public get PATH(): string {
    return Root.PATH;
  }

  public get QUERY(): Record<string, string> {
    return Root.QUERY;
  }

  public queryToObject<T extends object>(query: string): T {
    return Root.queryToObject(query);
  }
}
