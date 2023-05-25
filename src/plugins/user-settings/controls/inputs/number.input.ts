import { PluginUserOptionNumber } from '../../../../lib/types';
import { TextBoxBasedInput } from './textbox-based-input.class';

export class NumberInput extends TextBoxBasedInput<number> {
  protected getInputAttributes(): Record<string, string | boolean> & {
    name?: undefined;
    placeholder?: undefined;
    'data-key'?: undefined;
  } {
    const { min, max } = this.options as PluginUserOptionNumber;

    return {
      type: 'number',
      value: this.value?.toString() ?? '',
      min: min?.toString(),
      max: max?.toString(),
    };
  }
}
