import { EventEmitter } from 'events';
import { button } from '../../../elements/button';

export class ScrollDown extends EventEmitter {
  private _container = document.jpdb.findElement('.container.bugfix');

  constructor() {
    super();

    document.jpdb.adjacentElement(
      this._container,
      'afterbegin',
      button('Scroll to Extension settings', {
        handler: () => this.emit('scroll-down'),
        type: 'default',
      }),
    );
  }
}
