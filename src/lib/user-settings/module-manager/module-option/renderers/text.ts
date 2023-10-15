import { ModuleUserOptionNumber } from '../../module-options.type';
import { Renderer } from './lib/_renderer';

export class TextRenderer extends Renderer<ModuleUserOptionNumber, string> {
  public render(container: HTMLElement): void {
    document.jpdb.appendElement(
      container,
      document.util.textfield<string>({
        label: this._options.text!,
        name: this._options.key,
        value: this._getValue() ?? this._options.default,
        type: 'text',
        helpText: this._options.description,
        change: (value: string) => {
          this._setValue(value);
        },
      }),
    );
  }
}
