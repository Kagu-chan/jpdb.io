import { container } from './container';

export type CheckboxOptions = {
  change: (value: boolean) => void;
  name: string;
  label: string;
  value: boolean;
  helpText?: string;
};

export const checkbox = (options: CheckboxOptions): HTMLDivElement => {
  const input = document.jpdb.createElement('input', {
    attributes: {
      name: options.name,
      type: 'checkbox',
      'data-key': options.name,
    },
  });
  const c = container([
    input,
    {
      tag: 'label',
      innerHTML: options.label,
      attributes: {
        for: input.id,
      },
    },
  ]);

  input.checked = options.value;
  input.onchange = (): void => options.change(input.checked);

  c.classList.add('checkbox');

  if (options.helpText) {
    document.jpdb.appendElement(c, {
      tag: 'p',
      innerHTML: options.helpText,
      style: {
        opacity: '.8',
        marginLeft: '2rem',
      },
    });
  }

  return c;
};
