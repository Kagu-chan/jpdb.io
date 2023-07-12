import EventEmitter from 'events';
import { checkbox, CheckboxOptions } from '../../../elements/checkbox';

export type EnableDisableOptions = {
  name: string;
  displayText: string;
  value: boolean;
  change: CheckboxOptions['change'];
  description?: string;
};

export class EnableDisable extends EventEmitter {
  constructor(private _container: HTMLDivElement, options: EnableDisableOptions) {
    super();

    document.jpdb.appendElement(
      this._container,
      checkbox({
        label: options.displayText,
        name: options.name,
        value: options.value,
        helpText: options.description,
        change: options.change,
      }),
    );
  }
}
