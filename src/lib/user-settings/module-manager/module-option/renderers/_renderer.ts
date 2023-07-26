import { ModuleUserOption } from '../../module-options.type';

export abstract class Renderer<
  TOption extends ModuleUserOption = ModuleUserOption,
  TVal = unknown,
> {
  constructor(
    public _options: TOption,
    public _getValue: () => TVal,
    public _setValue: (val: TVal) => void,
  ) {}

  public abstract render(container: HTMLDivElement): void;
}
