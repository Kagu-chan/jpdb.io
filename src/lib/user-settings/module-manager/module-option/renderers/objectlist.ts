import { ModuleUserOptionObjectList } from '../../module-options.type';
import { Renderer } from './lib/_renderer';
import { objectlist } from './lib/objectlist';

export class ObjectListRenderer extends Renderer<ModuleUserOptionObjectList, object[]> {
  public render(container: HTMLDivElement): void {
    document.jpdb.appendElement(
      container,
      objectlist({
        label: this._options.text,
        name: this._options.key,
        value: this._getValue() ?? this._options.default,
        helpText: this._options.description,
        schema: this._options.schema,
        change: (value: object[]) => this._setValue(value),
      }),
    );
  }
}
