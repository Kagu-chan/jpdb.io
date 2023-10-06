import { ModuleUserOptionNumber } from '../../module-options.type';
import { Renderer } from './_renderer';

export class NumberRenderer extends Renderer<ModuleUserOptionNumber, number> {
  public render(container: HTMLElement): void {
    document.jpdb.appendElement(
      container,
      document.util.textfield<number>({
        label: this._options.text,
        name: this._options.key,
        value: this._getValue() ?? this._options.default,
        type: 'number',
        helpText: this._options.description,
        change: (value: number) => {
          this._setValue(value);
        },
      }),
    );
  }
}
