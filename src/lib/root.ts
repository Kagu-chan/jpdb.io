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
    const payload: Record<string, string> = {};

    this.SEARCH.split('&').forEach((c) => {
      const [key, val] = c.split('=');

      payload[key] = val;
    });

    return payload;
  }

  public get VERSION(): string {
    return Root.VERSION;
  }

  public get PATH(): string {
    return Root.PATH;
  }

  public get SEARCH(): string {
    return Root.SEARCH;
  }
}
