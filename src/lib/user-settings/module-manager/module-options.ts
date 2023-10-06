import { ModuleOption } from './module-option/module-option';
import { IModuleOptions } from './module-options.type';

export class ModuleOptions {
  private _container = document.util.container([]);

  constructor(private _data: IModuleOptions) {
    new ModuleOption(
      this._data.name,
      {
        type: 'checkbox',
        key: '_',
        hideOrDisable: 'hide',
        children: _data.options,
        indent: true,
        text: _data.displayText,
        description: this.getDescription(),
      },
      this._container,
      () => jpdb.settings.moduleManager.getActiveState(this._data.name),
      (value: boolean) => {
        value
          ? jpdb.settings.moduleManager.enableModule(this._data.name)
          : jpdb.settings.moduleManager.disableModule(this._data.name);

        jpdb.emit(value ? 'module-enabled' : 'module-disabled', this._data);
        jpdb.emit(value ? `${this._data.name}-enabled` : `${this._data.name}-disabled`, this._data);
        jpdb.toaster.toast(
          `${value ? 'Enabled' : 'Disabled'}: ${this._data.displayText} `,
          'success',
        );
      },
    );
  }

  public getEl(): HTMLDivElement {
    return this._container;
  }

  private getDescription(): string {
    const { description, author, source } = this._data;

    const { createElement } = document.jpdb;
    const formatString = (...parts: string[]): string =>
      parts
        .filter((v) => v?.length)
        .join(' ')
        .trim()
        .replace(/\s?\.\.?/, '.')
        .replace(/^\.\s*/, '') + ' ';

    if (!author?.length && !source?.length) {
      return description;
    }

    if (author?.length && source?.length) {
      const s = createElement('span', {
        innerText: formatString(description, '.', 'Created by'),
        children: [
          {
            tag: 'a',
            attributes: { href: source, target: '_blank' },
            innerText: author,
          },
        ],
      });

      return s.innerHTML;
    }

    if (author?.length) {
      const s = createElement('span', {
        innerText: formatString(description, '.', 'Created by'),
        children: [
          {
            tag: 'span',
            style: {
              color: 'green',
            },
            innerText: author,
          },
        ],
      });

      return s.innerHTML;
    }

    const s = createElement('span', {
      innerText: formatString(description, '.'),
      children: [
        {
          tag: 'a',
          attributes: { href: source, target: '_blank' },
          innerText: 'Original source',
        },
      ],
    });

    return s.innerHTML;
  }
}
