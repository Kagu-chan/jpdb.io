import { ModuleUserOptionRadioButton } from '../../module-options.type';
import { Renderer } from './_renderer';

export class RadioRenderer extends Renderer<ModuleUserOptionRadioButton, string> {
  public render(container: HTMLDivElement): void {
    document.jpdb.appendElement(
      container,
      document.util.radiobutton({
        label: this._options.text,
        name: this._options.key,
        value: this._getValue() ?? this._options.default,
        helpText: this._options.description,
        options: this._options.options,
        labels: this._options.labels,
        change: (value: string) => this._setValue(value),
      }),
    );
  }
}
