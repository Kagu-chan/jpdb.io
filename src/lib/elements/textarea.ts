import { container } from './container';

export type TextareaOptions = {
  change: (value: string) => void;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  helpText?: string | HTMLElement;
};

export const textarea = (options: TextareaOptions): HTMLDivElement => {
  const input = document.jpdb.createElement('textarea', {
    innerHTML: options.value,
    attributes: {
      name: options.name,
      placeholder: options.placeholder?.length
        ? options.placeholder
        : typeof options.helpText === 'string'
        ? options.helpText
        : options.helpText.innerHTML ?? '',
      spellcheck: 'false',
    },
    style: {
      height: '15rem',
    },
  });
  const ic = container([input]);
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

  ic.classList.add('style-textarea-handle');
  ic.style.marginTop = '1rem';

  input.onchange = (): void => options.change(input.value);

  if (options.helpText) {
    document.jpdb.appendElement(c, {
      tag: 'p',
      innerHTML: typeof options.helpText === 'string' ? options.helpText : undefined,
      children: typeof options.helpText !== 'string' ? [options.helpText] : [],
      style: {
        opacity: '.8',
      },
    });
  }

  return c;
};
