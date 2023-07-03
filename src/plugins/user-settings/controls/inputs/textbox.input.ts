import { TextBoxBasedInput } from './textbox-based-input.class';

export class TextBoxInput extends TextBoxBasedInput<string> {
  protected getInputAttributes(): Record<string, string | boolean> & {
    name?: undefined;
    placeholder?: undefined;
    'data-key'?: undefined;
  } {
    return {
      type: 'text',
      value: this._value ?? '',
    };
  }
}
