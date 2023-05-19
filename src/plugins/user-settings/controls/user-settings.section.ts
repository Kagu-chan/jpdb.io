import { DOMContainer } from '../../../lib/browser/dom-container';
import { UserSettingsContainer } from '../user-settings.container';
import { AppliedUserOption, PluginSettingsSection } from '../user-settings.types';

export class UserSettingsSection extends DOMContainer {
  private _activator: HTMLInputElement;
  private _container: HTMLDivElement;

  private get groupName(): string {
    return ['dep', this._name].join('-');
  }

  constructor(
    private _root: UserSettingsContainer,
    private _name: string,
    private _data: PluginSettingsSection,
  ) {
    super(`user-settings-${_name}`, _data.header);
  }

  public render(): void {
    super.render();

    this.headingElement.classList.add('subsection-header');

    this.renderOptions();
    this.addRemDiv();
  }

  protected attachToDom(element: HTMLDivElement): void {
    this.appendElement(this._root.dom, element);

    this._container = element;
  }

  protected renderOptions(): void {
    const [first, ...after] = this._data.options;

    this.addChangeEvent(this.renderFirst(first), first);
    after.forEach((o) => this.addChangeEvent(this.renderOption(o), o));
  }

  protected renderFirst(option: AppliedUserOption): HTMLInputElement | HTMLTextAreaElement {
    if (option.key === 'enabled') {
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
    const [option] = this._data.options;
    const name = [this._id, option.key].join('-');
    this._activator = this.renderCheckbox(
      name,
      option.text,
      this._data.plugin.getUsersSetting('enabled'),
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

  protected renderOption(option: AppliedUserOption): HTMLInputElement | HTMLTextAreaElement {
    const name = [this._id, option.key].join('-');
    const value = this._data.plugin.getUsersSetting(option.key);

    switch (option.type) {
      case 'boolean':
        return this.renderCheckbox(name, option.text, value as boolean);
      case 'text':
        return this.renderTextbox(name, option.text, value as string);
      case 'textarea':
        return this.renderTextarea(name, option.text, value as string);
      default:
        break;
    }
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
      innerText: value,
      attributes: {
        name,
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
      const value = e.type === 'checkbox' ? (e as HTMLInputElement).checked : e.value;

      this._data.plugin.setUsersSetting(o.key, value);
    });
  }
}
