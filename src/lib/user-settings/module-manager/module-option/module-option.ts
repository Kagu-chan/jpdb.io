import { container } from '../../../elements/container';
import { HasChildren, ModuleUserOption } from '../module-options.type';
import { Renderer } from './renderers/_renderer';
import { CheckboxRenderer } from './renderers/checkbox';
import { EmptyRenderer } from './renderers/empty-renderer';
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
    this._renderer = new ctor(_option, this._getValue(), this._setValue);

    this._renderer?.render(this._renderIn);

    if (this._option.children?.length) {
      const childsContainer = container([]);

      document.jpdb.appendElement(this._renderIn, childsContainer);
      this._option.children.forEach((c: ModuleUserOption) => {
        new ModuleOption(
          this._name,
          c,
          childsContainer,
          () => jpdb.settings.persistence.getModuleOption(this._name, c.key, c.default),
          (value: unknown) => {
            jpdb.toaster.toast('Saved...', 'success');
            jpdb.settings.persistence.setModuleOption(this._name, c.key, value);
          },
        );
      });

      this.updateChildOptions(childsContainer);
    }
  }

  private getRenderer(): new (o: ModuleUserOption, g: unknown, s: (v: unknown) => void) => Renderer<
    ModuleUserOption,
    unknown
  > {
    switch (this._option.type) {
      case 'checkbox':
        return CheckboxRenderer;
      case 'textarea':
        return TextareaRenderer;
      default:
        return EmptyRenderer;
    }
  }

  private updateChildOptions(childsContainer: HTMLDivElement): void {
    const o = this._option as HasChildren;

    if (o.indent) childsContainer.style.paddingLeft = o.indentWith ?? '2rem';

    if (this._option.type !== 'checkbox') return;

    const sv = this._renderer._setValue;

    this._renderer._setValue = (v: boolean): void => {
      if (o.hideOrDisable === 'hide') {
        sv(v);

        if (v) {
          childsContainer.classList.remove('hidden');
        } else {
          childsContainer.classList.add('hidden');
        }

        if (!this._getValue()) {
          childsContainer.classList.add('hidden');
        } else {
          // @TODO: Disable Children!
        }
      }
    };
  }
}
