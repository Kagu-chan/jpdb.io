import { ModuleUserOptionCheckbox } from '../../module-options.type';
import { Renderer } from './_renderer';

export class CheckboxRenderer extends Renderer<ModuleUserOptionCheckbox, boolean> {
  public render(container: HTMLDivElement): void {
    document.jpdb.appendElement(
      container,
      document.util.checkbox({
        label: this._options.text!,
        name: this._options.key,
        value: this._getValue() ?? this._options.default,
        helpText: this._options.description,
        change: (value: boolean) => {
          this._setValue(value);
        },
      }),
    );
  }
}
