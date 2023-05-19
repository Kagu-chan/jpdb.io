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
