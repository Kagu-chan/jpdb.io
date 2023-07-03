import { DOMElementTagOptions } from '../../../../lib/dom';
import { VirtualInput } from './virtual-input.class';

export class DividerInput extends VirtualInput {
  public getControls(): DOMElementTagOptions<any>[] {
    return [
      {
        tag: 'hr',
      },
    ];
  }

  public getInputElement(): DOMElementTagOptions<'input'> {
    return { tag: 'input' };
  }
  // protected renderVirtualItem(target: HTMLDivElement): void {
  //   this.append('main', target, 'hr');
  // }
}
