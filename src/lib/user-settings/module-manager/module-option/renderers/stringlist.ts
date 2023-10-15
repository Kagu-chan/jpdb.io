import { ModuleUserOptionStringList } from '../../module-options.type';
import { ItemList } from './lib/itemlist';

export class StringListRenderer extends ItemList<ModuleUserOptionStringList> {
  protected getEmptyItem(): string {
    return '';
  }

  protected stringToItem(val: string): string {
    return val;
  }

  protected itemToString(val: string): string {
    return val;
  }

  protected stringToItems(val: string): string[] {
    return JSON.parse(val) as string[];
  }

  protected itemsToString(val: string[]): string {
    return JSON.stringify(val);
  }
}
