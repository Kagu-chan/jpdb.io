import { VirtualInput } from './virtual-input.class';

export class DividerInput extends VirtualInput {
  protected renderVirtualItem(target: HTMLDivElement): void {
    this.append('main', target, 'hr');
  }
}
