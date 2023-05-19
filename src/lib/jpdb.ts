import { CSSManager } from './browser/css-manager';
import { DOMManager } from './browser/dom-manager';
import { Globals } from './globals';
import { Root } from './root';

export class JPDB extends Root {
  public get dom(): DOMManager {
    return Globals.domManager;
  }

  public get css(): CSSManager {
    return Globals.cssManager;
  }
}
