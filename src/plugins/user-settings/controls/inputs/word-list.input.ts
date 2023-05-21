import { ListBasedInput } from './list-based-input.class';

export class WordListInput extends ListBasedInput<string> {
  protected getItemListClass(): string {
    return 'word-list';
  }

  protected openOnStart(): boolean {
    return false;
  }

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

  protected renderInputItem(target: HTMLElement, value: string, id: number): HTMLInputElement {
    return this._dom.appendNewElement(target, 'input', {
      id: `${this.name}-${id}`,
      attributes: {
        name: `${this.name}-${id}`,
        value: this.itemToString(value),
        type: 'text',
      },
    });
  }
}
