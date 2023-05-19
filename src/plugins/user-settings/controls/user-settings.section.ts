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
      option,
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
      style: {
        marginTop: '1rem',
        marginLeft: '2rem',
      },
    });
  }

  protected renderOption(option: AppliedUserOption): HTMLInputElement | HTMLTextAreaElement {
    const name = [this._id, option.key].join('-');
    const value = this._data.plugin.getUsersSetting(option.key);

    switch (option.type) {
      case 'boolean':
        return this.renderCheckbox(name, option, value as boolean);
      case 'text':
        return this.renderTextbox(name, option, value as string);
      case 'textarea':
        return this.renderTextarea(name, option, value as string);
      default:
        break;
    }
  }

  protected renderCheckbox(
    name: string,
    { text, description }: AppliedUserOption,
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

    if (description?.length) this.renderHelpText(this._container, description, '2rem');

    input.checked = value;

    return input;
  }

  protected renderTextbox(
    name: string,
    { text, description }: AppliedUserOption,
    value: string,
    extraAttributes: Record<string, string> = {},
  ): HTMLInputElement {
    const outerDiv = this.appendNewElement(this._container, 'div', { class: ['form-box'] });
    const innerDiv = this.appendNewElement(outerDiv, 'div', {
      style: {
        marginBottom: '1rem',
      },
    });

    this.appendNewElement(innerDiv, 'label', {
      innerText: text,
      attributes: { for: name },
    });

    const input = this.appendNewElement(innerDiv, 'input', {
      id: name,
      attributes: {
        name,
        value: value ?? '',
        type: 'text',
        placeholder: text,
        ...extraAttributes,
      },
      style: {
        maxWidth: '16rem',
      },
    });

    if (description?.length) this.renderHelpText(innerDiv, description);

    return input;
  }

  protected renderTextarea(
    name: string,
    { text, description }: AppliedUserOption,
    value: string,
    extraAttributes: Record<string, string> = {},
  ): HTMLTextAreaElement {
    this.appendNewElement(this._container, 'label', {
      innerText: text,
      attributes: { for: name },
    });

    const container = this.appendNewElement(this._container, 'div', {
      class: ['style-textarea-handle'],
      style: { marginTop: '1rem' },
    });

    const input = this.appendNewElement(container, 'textarea', {
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

    if (description?.length) this.renderHelpText(this._container, description);

    return input;
  }

  protected renderHelpText(target: HTMLElement, description: string, marginLeft?: string): void {
    this.appendNewElement(target, 'p', {
      innerText: description,
      style: {
        opacity: '.8',
        marginLeft,
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
