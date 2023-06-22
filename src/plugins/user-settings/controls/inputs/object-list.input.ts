import { ObjectSchemaItem, PluginUserOptionObjectList } from '../../../../lib/types';
import { ListBasedInput } from './list-based-input.class';

export class ObjectListInput extends ListBasedInput<Record<string, string | number>> {
  protected getItemListClass(): string {
    return 'object-list';
  }

  protected openOnStart(): boolean {
    return false;
  }

  protected getEmptyItem(): Record<string, string | number> {
    const object: Record<string, string | number> = {};

    (this.options as PluginUserOptionObjectList).schema.forEach(({ key, type, min }) => {
      object[key] = type === 'text' ? '' : min ?? 0;
    });

    return object;
  }

  protected stringToItem(val: string): Record<string, string | number> {
    return JSON.parse(val) as Record<string, string | number>;
  }

  protected itemToString(val: Record<string, string | number>): string {
    return JSON.stringify(val);
  }

  protected stringToItems(val: string): Record<string, string | number>[] {
    return JSON.parse(val) as Record<string, string | number>[];
  }

  protected itemsToString(val: Record<string, string | number>[]): string {
    return JSON.stringify(val);
  }

  protected renderInputHeaderContent(target: HTMLDivElement): void {
    const { schema } = this.options as PluginUserOptionObjectList;

    schema.forEach((current: ObjectSchemaItem) => {
      this._dom.appendNewElement(target, 'label', {
        innerText: current.label,
        attributes: { for: `${this.name}-${current.key}-0` },
        style: { paddingTop: '1rem', paddingLeft: '.5rem' },
      });
    });
  }

  protected renderInputItem(
    target: HTMLElement,
    value: Record<string, string | number>,
    id: number,
  ): HTMLInputElement {
    const { schema } = this.options as PluginUserOptionObjectList;
    const localInputs: HTMLInputElement[] = [];

    const input = this._dom.appendNewElement(target, 'input', {
      id: `${this.name}-${id}`,
      attributes: {
        name: `${this.name}-${id}`,
        value: this.itemToString(value),
        type: 'text',
      },
      class: ['hidden'],
    });

    schema.forEach((current: ObjectSchemaItem, cid: number) => {
      const i = this._dom.appendNewElement(target, 'input', {
        id: `${this.name}-${current.key}-${id}`,
        attributes: {
          name: `${this.name}-${current.key}-${id}`,
          value: value[current.key] as string,
          type: current.type,
          min: current.min?.toString(),
          max: current.max?.toString(),
        },
      });

      i.addEventListener('blur', () => {
        value[current.key] = current.type === 'number' ? Number(i.value) : i.value;
        input.value = this.itemToString(value);
      });
      i.addEventListener('keypress', (e) => {
        if (e.key !== 'Enter') return;

        if (cid === schema.length - 1) {
          input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        } else {
          localInputs[cid + 1].focus();
        }
      });

      localInputs.push(i);
    });

    input.addEventListener('focus', () => {
      localInputs[0].focus();
    });
    input.focus = (): void => localInputs[0].focus();

    return input;
  }
}
