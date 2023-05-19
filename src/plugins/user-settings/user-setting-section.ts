import { DOMContainer } from '../../lib/browser/dom-container';
import { UserSettingsPluginAPI } from './user-settings-plugin.api';
import { AppliedUserOption, PluginSettingsSection } from './user-settings.types';

export class UserSettingSection extends DOMContainer {
  private _activator: HTMLInputElement;
  private _container: HTMLDivElement;

  private get groupName(): string {
    return ['dep', this._name].join('-');
  }

  constructor(
    private _parent: DOMContainer,
    private _api: UserSettingsPluginAPI,
    private _name: string,
    private _options: PluginSettingsSection,
  ) {
    super(`user-settings-${_name}`, _options.header);
  }

  public render(): void {
    super.render();

    this.headingElement.classList.add('subsection-header');

    this.renderOptions();
    this.addRemDiv();
  }

  protected attachToDom(element: HTMLDivElement): void {
    this.appendElement(this._parent.dom, element);

    this._container = element;
  }

  protected renderOptions(): void {
    const [first, ...after] = this._options.options;

    this.addChangeEvent(this.renderFirst(first), first);
    after.forEach((o) => this.addChangeEvent(this.renderOption(o), o));
  }

  protected renderFirst(option: AppliedUserOption): HTMLInputElement | HTMLTextAreaElement {
    if (option.key === 'enable') {
      this.renderActivator();
      this.renderActivatedContainer();

      this.addAndRunEventListener(this._activator, 'change', (): void => {
        this.hidden(this._container, !this._activator.checked);
      });

      return this._activator;
    }

    return this.renderOption(option);
  }

  protected renderActivator(): void {
    const [option] = this._options.options;
    const name = [this._id, option.key].join('-');
    this._activator = this.renderCheckbox(
      name,
      option.text,
      false, // this._options.options[0].value as boolean,
      {
        'data-when-unchecked-hide': this.groupName,
      },
    );
  }

  protected renderActivatedContainer(): void {
    this._container = this.appendNewElement(this._container, 'div', {
      attributes: {
        'data-group': this.groupName,
      },
    });
  }

  protected renderOption(_option: AppliedUserOption): HTMLInputElement | HTMLTextAreaElement {
    return;
    // const name = [this._id, option.key].join('-');

    // switch (option.type) {
    //   case 'boolean':
    //     return this.renderCheckbox(name, option.text, option.value as boolean);
    //   case 'text':
    //     return this.renderTextbox(name, option.text, option.value as string);
    //   case 'textarea':
    //     return this.renderTextarea(name, option.text, option.value as string);
    //   default:
    //     break;
    // }
  }

  protected renderCheckbox(
    name: string,
    text: string,
    value: boolean,
    extraAttributes: Record<string, string> = {},
  ): HTMLInputElement {
    const checkbox = this.appendNewElement(this._container, 'div', { class: ['checkbox'] });
    const input = this.appendNewElement(checkbox, 'input', {
      id: name,
      attributes: {
        name,
        type: 'checkbox',
        ...extraAttributes,
      },
    });

    this.appendNewElement(checkbox, 'label', {
      innerText: text,
      attributes: { for: name },
    });

    input.checked = value;

    return input;
  }

  protected renderTextbox(
    name: string,
    text: string,
    value: string,
    extraAttributes: Record<string, string> = {},
  ): HTMLInputElement {
    const outerDiv = this.appendNewElement(this._container, 'div', { class: ['form-box'] });
    const innerDiv = this.appendNewElement(outerDiv, 'div');

    this.appendNewElement(innerDiv, 'label', {
      innerText: text,
      attributes: { for: name },
    });

    return this.appendNewElement(innerDiv, 'input', {
      id: name,
      attributes: {
        name,
        value,
        type: 'text',
        placeholder: text,
        ...extraAttributes,
      },
      style: {
        maxWidth: '16rem',
      },
    });
  }

  protected renderTextarea(
    name: string,
    text: string,
    value: string,
    extraAttributes: Record<string, string> = {},
  ): HTMLTextAreaElement {
    this.appendNewElement(this._container, 'label', {
      innerText: text,
      attributes: { for: name },
    });

    const container = this.appendNewElement(this._container, 'div', {
      class: ['style-textarea-handle'],
    });

    return this.appendNewElement(container, 'textarea', {
      id: name,
      attributes: {
        name,
        value,
        placeholder: text,
        spellcheck: 'false',
        ...extraAttributes,
      },
      style: {
        height: '20rem',
      },
    });
  }

  protected addChangeEvent(e: HTMLInputElement | HTMLTextAreaElement, o: AppliedUserOption): void {
    this.addEventListener(e, 'change', (): void => {
      // o.value = e.type === 'checkbox' ? (e as HTMLInputElement).checked : e.value;

      this._api.updateSetting(this._name, o);
    });
  }
  /*
  
  private getFirstSectionControl(
    into: HTMLDivElement,
    key: string,
    first: AppliedUserOption,
  ): HTMLDivElement {
    if (first.key === 'enable') {
      const input = this.addEnableDisable(into, key, first);
      const target = this.addDataGroup(into, key, first);

      Globals.domManager.addAndRunEventListener(input, 'change', (): void =>
        Globals.domManager.hidden(target, !input.checked),
      );

      return target;
    }

    const e = Globals.domManager.findOne(`#user-settings-${key}`, 'div');

    this.addSettingsObject(e, first);

    return e;
  }

  private addSection(key: string, header: string): HTMLDivElement {
    Globals.domManager.appendNewElement(this.domElement, 'div', {
      innerText: header,
      class: ['subsection-header'],
    });

    return Globals.domManager.appendNewElement(this.domElement, 'div', {
      id: 'user-settings-' + key,
    });
  }

  private addEnableDisable(
    into: HTMLDivElement,
    parent: string,
    options: AppliedUserOption,
  ): HTMLInputElement {
    const name = `${parent}-${options.key}`;
    const checkbox = Globals.domManager.appendNewElement(into, 'div', { class: ['checkbox'] });
    const input = Globals.domManager.appendNewElement(checkbox, 'input', {
      id: name,
      attributes: {
        name,
        type: 'checkbox',
        'data-when-unchecked-hide': `dep-${name}`,
        checked: options.value as boolean,
      },
    });
    input.checked = options.value as boolean;

    Globals.domManager.appendNewElement(checkbox, 'label', {
      innerText: options.text,
      attributes: { for: name },
    });

    return input;
  }

  private addDataGroup(
    into: HTMLDivElement,
    parent: string,
    options: AppliedUserOption,
  ): HTMLDivElement {
    const name = `dep-${parent}-${options.key}`;

    return Globals.domManager.appendNewElement(into, 'div', {
      innerText: 'Lorem Ipsum',
      attributes: {
        'data-group': name,
      },
    });
  }

  private addSettingsObject(into: HTMLDivElement, object: AppliedUserOption): HTMLElement {
    return Globals.domManager.appendNewElement(into, 'p', {
      innerText: JSON.stringify(object),
    });
  }
  */
}
