import EventEmitter from 'events';
import { InfoSection } from './info-section/info-section';

export class SettingsUI extends EventEmitter {
  // private _container = document.jpdb.findElement('.container.bugfix');

  private _infos: InfoSection = new InfoSection();

  constructor() {
    super();

    window.bubble(this._infos, this, 'reset', 'reset-all');
  }
}
