import { container } from './container';
import { getHelpTextConfig } from './internal/get-help-text-config';

declare global {
  interface CheckboxOptions {
    change: (value: boolean) => void;
    name: string;
    label: string;
    value: boolean;
    helpText?: string | HTMLElement;
  }
}

export const checkbox = (options: CheckboxOptions): HTMLDivElement => {
  const input = document.jpdb.createElement('input', {
    attributes: {
      name: options.name,
      type: 'checkbox',
      'data-key': options.name,
    },
  });
  const c = container(
    [
      input,
      {
        tag: 'label',
        innerHTML: options.label,
        attributes: {
          for: input.id,
        },
      },
    ],
    { class: 'checkbox' },
  );

  input.checked = options.value;
  input.onchange = (): void => options.change(input.checked);

  if (options.helpText) {
    const hco = getHelpTextConfig(options.helpText);
    hco.style.marginLeft = '2rem';

    return container([c, hco]);
  }

  return c;
};
