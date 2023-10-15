import { ModuleUserOptionObjectList, ObjectSchemaItem } from '../../module-options.type';
import { ListRenderer } from './lib/_list';

export class ObjectListRenderer extends ListRenderer<
  ModuleUserOptionObjectList,
  Record<string, string | number>
> {
  protected getItemListClass(): string {
    return 'object-list';
  }

  protected getEmptyItem(): Record<string, string | number> {
    const object: Record<string, string | number> = {};

    this._options.schema.forEach((current) => {
      switch (current.type) {
        case 'text':
          object[current.key] = '';

          break;
        case 'number':
          object[current.key] = current.min ?? 0;

          break;
      }
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

  protected renderInputHeaderContent(): void {
    this._options.schema.forEach((current: ObjectSchemaItem) => {
      document.jpdb.appendElement(this._accordionHeader, {
        tag: 'label',
        innerText: current.label,
        attributes: { for: `${this._options.key}-${current.key}-0` },
        style: { paddingTop: '1rem', paddingLeft: '.5rem' },
      });
    });
  }

  protected getSingleInputRow(
    value: Record<string, string | number>,
    id: number,
    container: HTMLDivElement,
  ): HTMLInputElement {
    const { schema } = this._options;
    const localInputs: HTMLInputElement[] = [];

    const input = document.jpdb.createElement({
      tag: 'input',
      id: `${this._options.key}-${id}`,
      attributes: {
        name: `${this._options.key}-${id}`,
        value: this.itemToString(value),
        type: 'text',
      },
      class: ['hidden'],
    });

    schema.forEach((current: ObjectSchemaItem, cid: number) => {
      const attributes: Record<string, string | boolean> = {
        name: `${this._options.key}-${current.key}-${id}`,
        type: current.type,
        value: value[current.key] as string,
      };

      switch (current.type) {
        case 'number':
          attributes.min = current.min?.toString() ?? false;
          attributes.max = current.max?.toString() ?? false;

          break;
        default:
        /* NOP */
      }

      const i = document.jpdb.createElement({
        tag: 'input',
        id: `${this._options.key}-${current.key}-${id}`,
        attributes,
      });

      document.jpdb.appendElement(container, i);

      i.addEventListener('blur', () => {
        value[current.key] = current.type === 'number' ? Number(i.value) : i.value;
        input.value = this.itemToString(value);
      });
      i.addEventListener('keypress', (e) => {
        if (e.key !== 'Enter') {
          return;
        }

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
