import EventEmitter from 'events';
import { checkbox, CheckboxOptions } from '../../../elements/checkbox';

export type EnableDisableOptions = {
  name: string;
  displayText: string;
  value: boolean;
  change: CheckboxOptions['change'];
  author?: string;
  source?: string;
  description?: string;
};

export class EnableDisable extends EventEmitter {
  constructor(private _container: HTMLDivElement, options: EnableDisableOptions) {
    super();

    const { description, author, source } = options;
    const helpText = this.getHelpText(description, author, source);
    document.jpdb.appendElement(
      this._container,
      checkbox({
        label: options.displayText,
        name: options.name,
        value: options.value,
        change: (value: boolean) => {
          options.change(value);

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
        innerText: formatString(description, '.', 'Created by', author),
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
