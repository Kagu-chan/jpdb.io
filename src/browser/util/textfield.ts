import { container } from './container';
import { appendHelpText } from './internal/append-help-text';
import { getPlaceholder } from './internal/get-placeholder';

declare global {
  interface TextfieldOptions<T extends string | number> {
    change: (value: T) => void;
    name: string;
    label: string;
    value: T;
    type: T extends string ? 'text' : 'number';
    min?: T extends number ? number : never;
    max?: T extends number ? number : never;
    placeholder?: string;
    helpText?: string | HTMLElement;
  }
}

export const textfield = <T extends string | number>(
  options: TextfieldOptions<T>,
): HTMLDivElement => {
  const input = document.jpdb.createElement('input', {
    attributes: {
      name: options.name,
      type: options.type,
      value: options.value?.toString(),
      placeholder: getPlaceholder(options),
      'data-key': options.name,
    },
    style: {
      maxWidth: '16rem',
    },
  });

  input.onchange = (): void =>
    options.change((options.type === 'number' ? Number(input.value) : input.value) as T);

  if (options.type === 'number') {
    options.min !== undefined && input.setAttribute('min', options.min.toString());
    options.max !== undefined && input.setAttribute('max', options.max.toString());
  }

  const inner = container([
    {
      tag: 'label',
      innerHTML: options.label,
      attributes: {
        for: input.id,
      },
    },
    input,
  ]);

  const outer = container([inner], { class: 'form-box' });

  appendHelpText(inner, options.helpText);

  return outer;
};
