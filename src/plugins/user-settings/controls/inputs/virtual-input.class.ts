import { Input } from './input.class';

export abstract class VirtualInput extends Input<boolean> {
  protected _virtual: boolean = true;

  // protected render(): HTMLInputElement {
  //   const div = this.append('container', this.container, 'div');

  //   this.renderVirtualItem(div);
  //   const hiddenInput = this.append('container', div, 'input', {
  //     id: this.name,
  //     attributes: {
  //       disabled: true,
  //       name: this.name,
  //       type: 'checkbox',
  //       'data-key': this.options.key,
  //     },
  //     class: ['hidden'],
  //   });

  //   hiddenInput.checked = true;

  //   return hiddenInput;
  // }

  // protected readValue(): boolean {
  //   return true;
  // }

  public getValue(): boolean {
    return true;
  }

  // protected abstract renderVirtualItem(target: HTMLDivElement): void;
}
