import {
  ModuleUserOptionStringList,
  ModuleUserOptionNumberList,
} from '../../../module-options.type';
import { ListRenderer } from './_list';

export abstract class ItemList<
  TOptions extends ModuleUserOptionStringList | ModuleUserOptionNumberList,
> extends ListRenderer<TOptions, TOptions extends ModuleUserOptionStringList ? string : number> {
  protected getItemListClass(): string {
    return 'word-list';
  }

  protected getSingleInputRow(
    value: TOptions extends ModuleUserOptionStringList ? string : number,
    id: number,
  ): HTMLInputElement {
    return document.jpdb.createElement('input', {
      id: `${this._options.key}-${id}`,
      attributes: {
        type: 'text',
        name: `${this._options.key}-${id}`,
        value: value.toString(),
        ...this.getInputProps(),
      },
    });
  }

  protected getInputProps(): Record<string, string | boolean> {
    return {};
  }
}
