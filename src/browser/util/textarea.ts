import { container } from './container';
import { appendHelpText } from './internal/append-help-text';
import { getPlaceholder } from './internal/get-placeholder';

declare global {
  interface TextareaOptions {
    change: (value: string) => void;
    name: string;
    label: string;
    value: string;
    placeholder?: string;
    helpText?: string | HTMLElement;
  }
}

export const textarea = (options: TextareaOptions): HTMLDivElement => {
  const input = document.jpdb.createElement('textarea', {
    innerHTML: options.value,
    attributes: {
      name: options.name,
      placeholder: getPlaceholder(options),
      'data-key': options.name,
      spellcheck: 'false',
    },
    style: {
      height: '15rem',
    },
  });
  const ic = container([input], { class: 'style-textarea-handle', style: { marginTop: '1rem' } });
  const c = container([
    {
      tag: 'label',
      innerHTML: options.label,
      attributes: {
        for: input.id,
      },
    },
    ic,
  ]);

  input.onchange = (): void => options.change(input.value);

  appendHelpText(c, options.helpText);

  return c;
};
