import EventEmitter from 'events';
import { findElement } from '../../dom';
import { InfoSection } from './info-section/info-section';

export class SettingsUI extends EventEmitter {
  private _container = findElement('.container.bugfix');

  private _infos: InfoSection = new InfoSection();

  constructor() {
    super();

    bubble(this._infos, this, 'reset');
  }
}
