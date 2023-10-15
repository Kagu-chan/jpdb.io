import { ModuleUserOption } from '../../../module-options.type';

export abstract class Renderer<
  TOption extends ModuleUserOption = ModuleUserOption,
  TVal = unknown,
> {
  public _setValue: (val: TVal) => void;

  constructor(
    public _scope: string,
    public _options: TOption,
    public _getValue: () => TVal,
    _setValue: (val: TVal) => void,
  ) {
    this._setValue = (val: TVal): void => {
      _setValue(val);

      jpdb.emit(`update-${_scope}-${_options.key}`, val);
    };
  }

  public abstract render(container: HTMLDivElement): void;
}
