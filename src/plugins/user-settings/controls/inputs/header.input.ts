import { VirtualInput } from './virtual-input.class';

export class HeaderInput extends VirtualInput {
  protected renderVirtualItem(target: HTMLDivElement): void {
    this.append('main', target, 'div', {
      innerText: this.options.text,
      style: {
        marginTop: '.5rem',
      },
    });
  }
}
