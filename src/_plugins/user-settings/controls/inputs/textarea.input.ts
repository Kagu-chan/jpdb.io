import { Input } from './input.class';

export class TextAreaInput extends Input<string, HTMLTextAreaElement> {
  protected render(): HTMLTextAreaElement {
    this.renderLabel(this.container);

    this.append('outer', this.container, 'div', {
      class: ['style-textarea-handle'],
      style: { marginTop: '1rem' },
    });

    const input = this.append('input', 'outer', 'textarea', {
      id: this.name,
      innerHTML: this.value,
      attributes: {
        name: this.name,
        placeholder: this.options.text?.length ? this.options.text : '',
        spellcheck: 'false',
        'data-key': this.options.key,
      },
      style: { height: '15rem' },
    });

    this.renderDescription(this.container);

    return input;
  }
}
