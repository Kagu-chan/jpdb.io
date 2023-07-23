import { checkbox, CheckboxOptions } from '../../../elements/checkbox';

export type ModuleSettingsOptions = {
  name: string;
  displayText: string;
  category: string;
  value: boolean;
  change: CheckboxOptions['change'];
  author?: string;
  source?: string;
  description?: string;
  experimental?: boolean;
};

export class ModuleSettingsContainer {
  private _rendered: HTMLElement;

  public get rendered(): HTMLElement {
    return this._rendered;
  }

  constructor(private _container: HTMLElement, options: ModuleSettingsOptions) {
    const { description, author, source } = options;
    const helpText = this.getHelpText(description, author, source);

    this._rendered = document.jpdb.adjacentElement(
      this._container,
      'afterend',
      checkbox({
        label: options.displayText,
        name: options.name,
        value: options.value,
        change: (value: boolean) => {
          options.change(value);

          jpdb.emit(value ? 'module-enabled' : 'module-disabled', options);
          jpdb.emit(value ? `${options.name}-enabled` : `${options.name}-disabled`, options);
          jpdb.toaster.toast(
            `${value ? 'Enabled' : 'Disabled'}: ${options.displayText} `,
            'success',
          );
        },
        helpText,
      }),
    );
  }

  private getHelpText(
    description?: string,
    author?: string,
    source?: string,
  ): string | HTMLElement | undefined {
    const { createElement } = document.jpdb;
    const formatString = (...parts: string[]): string =>
      parts
        .filter((v) => v?.length)
        .join(' ')
        .trim()
        .replace(/\s?\.\.?/, '.')
        .replace(/^\.\s*/, '') + ' ';

    if (!author?.length && !source?.length) return description;

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

      return s;
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

      return s;
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

    return s;
  }
}
