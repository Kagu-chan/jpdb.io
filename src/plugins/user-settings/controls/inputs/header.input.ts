import { DOMElementTagOptions } from '../../../../lib/dom';
import { VirtualInput } from './virtual-input.class';

export class HeaderInput extends VirtualInput {
  public getControls(): DOMElementTagOptions<any>[] {
    return [
      {
        tag: 'div',
        innerText: this.options.text,
        style: {
          marginTop: '.5rem',
        },
      },
    ];
  }
  // protected renderVirtualItem(target: HTMLDivElement): void {
  //   this.append('main', target, 'div', {
  //     innerText: this.options.text,
  //     style: {
  //       marginTop: '.5rem',
  //     },
  //   });
  // }
  public getInputElement(): DOMElementTagOptions<'input'> {
    return { tag: 'input' };
  }
}
