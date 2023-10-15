import { HasChildren, ModuleUserOption } from '../module-options.type';
import { Renderer } from './renderers/_renderer';
import { CheckboxRenderer } from './renderers/checkbox';
import { EmptyRenderer } from './renderers/empty-renderer';
import { NumberRenderer } from './renderers/number';
import { RadioRenderer } from './renderers/radio';
import { TextareaRenderer } from './renderers/textarea';

export class ModuleOption {
  private _renderer: Renderer<ModuleUserOption, unknown>;

  constructor(
    private _name: string,
    private _option: ModuleUserOption,
    private _renderIn: HTMLDivElement,
    private _getValue: () => unknown,
    private _setValue: (val: unknown) => void,
  ) {
    const ctor = this.getRenderer();

    this._renderer = new ctor(_name, _option, this._getValue, this._setValue);
    this._renderer?.render(this._renderIn);

    const children = this._option.children?.filter((c) => !!c) ?? [];

    if (children.length) {
      const childsContainer = document.util.container([]);

      document.jpdb.appendElement(this._renderIn, childsContainer);
      children.forEach((c: ModuleUserOption) => {
        new ModuleOption(
          this._name,
          c,
          childsContainer,
          () => jpdb.settings.persistence.getModuleOption(this._name, c.key),
          (value: unknown) => {
            jpdb.toaster.toast('Saved...', 'success');
            jpdb.settings.persistence.setModuleOption(this._name, c.key, value);
          },
        );
      });

      this.updateChildOptions(childsContainer);
    }
  }

  private getRenderer(): new (
    s: string,
    o: ModuleUserOption,
    gv: () => unknown,
    sv: (v: unknown) => void,
  ) => Renderer<ModuleUserOption, unknown> {
    switch (this._option.type) {
      case 'checkbox':
        return CheckboxRenderer;
      case 'radio':
        return RadioRenderer;
      case 'textarea':
        return TextareaRenderer;
      case 'number':
        return NumberRenderer;
      default:
        return EmptyRenderer;
    }
  }

  private updateChildOptions(childsContainer: HTMLDivElement): void {
    const o = this._option as HasChildren;

    if (o.indent) {
      childsContainer.style.paddingLeft = o.indentWith ?? '2rem';
    }

    if (this._option.type !== 'checkbox') {
      return;
    }

    const sv = this._renderer._setValue;
    const isHide = o.hideOrDisable === 'hide';
    const cls = o.hideOrDisable === 'hide' ? 'hidden' : 'disabled';

    const setTrue = (): void =>
      isHide ? childsContainer.classList.remove(cls) : this.enableTree(childsContainer);
    const setFalse = (): void =>
      isHide ? childsContainer.classList.add(cls) : this.disableTree(childsContainer);

    this._renderer._setValue = (v: boolean): void => {
      sv(v);

      return v ? setTrue() : setFalse();
    };

    if (!this._getValue()) {
      setFalse();
    }
  }

  private disableTree(c: HTMLDivElement): void {
    document.jpdb.withElements(c, 'input:not(:disabled)', (i: HTMLInputElement) => {
      i.classList.add(`disabled-by-${this._option.key}`);
      i.disabled = true;
    });
  }

  private enableTree(c: HTMLDivElement): void {
    document.jpdb.withElements(
      c,
      `input.disabled-by-${this._option.key}`,
      (i: HTMLInputElement) => {
        i.classList.remove(`disabled-by-${this._option.key}`);

        if (!Array.from(i.classList).find((c) => c.startsWith('disabled-by-'))) {
          i.disabled = false;
        }
      },
    );
  }
}
