import { ModuleUserOptionNumberList } from '../../module-options.type';
import { ItemList } from './lib/itemlist';

export class NumberListRenderer extends ItemList<ModuleUserOptionNumberList> {
  protected getInputProps(): Record<string, string | boolean> {
    const props: Record<string, string | boolean> = {
      type: 'number',
    };

    if (this._options.min) {
      props.min = this._options.min.toString();
    }

    if (this._options.max) {
      props.max = this._options.max.toString();
    }

    return props;
  }

  protected getEmptyItem(): number {
    return 0;
  }

  protected stringToItem(val: string): number {
    return Number(val);
  }

  protected itemToString(val: number): string {
    return val.toString();
  }

  protected stringToItems(val: string): number[] {
    return JSON.parse(val) as number[];
  }

  protected itemsToString(val: number[]): string {
    return JSON.stringify(val);
  }
}
