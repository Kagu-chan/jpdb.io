import { container } from './container';
import { appendHelpText } from './internal/append-help-text';

declare global {
  interface RadiobuttonOptions {
    change: (value: string) => void;
    name: string;
    label: string;
    value: string;
    options: object;
    labels: object;
    helpText?: string | HTMLElement;
  }
}

export const radiobutton = (options: RadiobuttonOptions): HTMLDivElement => {
  const input = document.jpdb.createElement('input', {
    attributes: {
      name: options.name,
      type: 'text',
      value: options.value,
      'data-key': options.name,
      disabled: true,
    },
    class: 'hidden',
  });

  const radioOptions = container(
    Object.values(options.options).map((option: string) => {
      const cInp = document.jpdb.createElement('input', {
        attributes: {
          name: options.name,
          value: option,
          type: 'radio',
        },
      });
      const cCon = container(
        [
          cInp,
          {
            tag: 'label',
            innerText: options.labels[option as keyof typeof options.labels],
            attributes: { for: cInp.id },
          },
        ],
        { class: 'checkbox' },
      );

      if (option === options.value) {
        cInp.checked = true;
      }
      cInp.addEventListener('change', () => {
        input.value = option;
        input.dispatchEvent(new Event('change'));
      });

      return cCon;
    }),
    {
      style: {
        marginLeft: '1rem',
        marginTop: '.5rem',
        marginBottom: '.5rem',
      },
    },
  );

  const helpContainer = container([]);
  const mainContainer = container([
    input,
    {
      tag: 'label',
      innerHTML: options.label,
      attributes: {
        for: input.id,
      },
    },
    helpContainer,
    radioOptions,
  ]);

  input.onchange = (): void => options.change(input.value);
  appendHelpText(helpContainer, options.helpText);

  return mainContainer;
};
