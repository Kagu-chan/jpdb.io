import { DOMElementTagOptions } from '../../../../lib/dom';
import { PluginUserOptionRadioButton } from '../../../../lib/types';
import { Input } from './input.class';

export class RadioButtonInput extends Input<string> {
  public getInputElement(): DOMElementTagOptions<'input'> {
    return {
      tag: 'input',
      id: this.name,
      attributes: {
        name: this.name,
        type: 'text',
        value: this._value,
        'data-key': this.options.key,
        disabled: true,
      },
      class: ['hidden'],
    };
  }

  public getControls(): DOMElementTagOptions<any>[] {
    return [
      {
        tag: 'div',
        children: [
          this.getLabel(),
          {
            tag: 'div',
            style: {
              marginLeft: '1rem',
              marginTop: '.5rem',
              marginBottom: '.5rem',
            },
            children: this.getChildren(),
          },
          this.retrieveInput(),
        ],
      },
    ];
  }

  public getChildren(): DOMElementTagOptions<any>[] {
    const { options, labels } = this.options as PluginUserOptionRadioButton;
    const nestedChilds = Object.values(options).map(
      (value: string): DOMElementTagOptions<any>[] => {
        return [
          {
            tag: 'div',
            class: ['checkbox'],
            children: [
              {
                tag: 'input',
                id: `${this.name}-${value}`,
                attributes: {
                  name: this.name,
                  value,
                  type: 'radio',
                },
                afterrender: (e: HTMLInputElement): void => {
                  if (value === this._value) {
                    e.checked = true;
                  }

                  e.addEventListener('change', () => {
                    const { element } = this.retrieveInput();

                    element.value = e.value;
                    element.dispatchEvent(new Event('change'));
                  });
                },
              },
              {
                tag: 'label',
                innerText: labels[value as keyof typeof labels],
                attributes: {
                  for: `${this.name}-${value}`,
                },
              },
            ],
          },
        ];
      },
    );

    return nestedChilds.flat();
  }
}
