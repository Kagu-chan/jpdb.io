import { ModuleUserOption } from '../../module-options.type';
import { Renderer } from './lib/_renderer';

export class EmptyRenderer extends Renderer<ModuleUserOption, unknown> {
  public render(container: HTMLDivElement): void {
    document.jpdb.appendElement(container, {
      tag: 'p',
      innerText: `Option not supported! [${this._options.type}=>${this._options.key}]`,
    });
  }
}
