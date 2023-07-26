import { textarea } from '../../../../elements/textarea';
import { ModuleUserOptionTextarea } from '../../module-options.type';
import { Renderer } from './_renderer';

export class TextareaRenderer extends Renderer<ModuleUserOptionTextarea, string> {
  public render(container: HTMLDivElement): void {
    document.jpdb.appendElement(
      container,
      textarea({
        label: this._options.text,
        name: this._options.key,
        value: this._value ?? this._options.default,
        helpText: this._options.description,
        placeholder: this._options.placeholder,
        change: (value: string) => this._setValue(value),
      }),
    );
  }
}
