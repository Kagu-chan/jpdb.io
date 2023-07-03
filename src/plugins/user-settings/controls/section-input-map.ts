import { PluginUserOption, PluginUserOptionFieldType } from '../../../lib/types';
import { CheckBoxInput } from './inputs/checkbox.input';
import { DividerInput } from './inputs/divider.input';
import { HeaderInput } from './inputs/header.input';
import { Input } from './inputs/input.class';
import { NumberInput } from './inputs/number.input';
import { ObjectListInput } from './inputs/object-list.input';
import { RadioButtonInput } from './inputs/radiobutton.input';
import { TextAreaInput } from './inputs/textarea.input';
import { TextBoxInput } from './inputs/textbox.input';
import { WordListInput } from './inputs/word-list.input';

export const SectionInputMap: Record<
  PluginUserOptionFieldType,
  new (name: string, options: PluginUserOption, value: unknown) => Input<unknown>
> = {
  [PluginUserOptionFieldType.HEADER]: HeaderInput,
  [PluginUserOptionFieldType.DIVIDER]: DividerInput,
  [PluginUserOptionFieldType.CHECKBOX]: CheckBoxInput,
  [PluginUserOptionFieldType.RADIOBUTTON]: RadioButtonInput,
  [PluginUserOptionFieldType.TEXT]: TextBoxInput,
  [PluginUserOptionFieldType.TEXTAREA]: TextAreaInput,
  [PluginUserOptionFieldType.NUMBER]: NumberInput,
  [PluginUserOptionFieldType.LIST]: WordListInput,
  [PluginUserOptionFieldType.OBJECTLIST]: ObjectListInput,
};
