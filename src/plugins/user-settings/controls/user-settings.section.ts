import { DOMContainer } from '../../../lib/browser/dom-container';
import {
  PluginUserOption,
  PluginUserOptionDep,
  PluginUserOptionNumber,
  PluginUserOptions,
} from '../../../lib/types';
import { UserSettingsContainer } from '../user-settings.container';
import { PluginSectionContainer, PluginSettingsSection } from '../user-settings.types';

export class UserSettingsSection extends DOMContainer {
  private _container: HTMLDivElement;

  constructor(
    private _root: UserSettingsContainer,
    private _name: string,
    private _data: PluginSettingsSection,
  ) {
    super(
      `user-settings-${_name}`,
      _data.plugin.pluginOptions.canBeDisabled ? undefined : _data.header,
    );
  }

  public render(): void {
    super.render();

    if (this.headingElement) {
      this.headingElement.classList.add('subsection-header');
      this.headingElement.style.marginTop = '1rem';
    }

    this.renderOptions();
  }

  protected attachToDom(element: HTMLDivElement): void {
    this.appendElement(this._root.dom, element);

    this._container = element;
  }

  protected renderOptions(): void {
    const { childs }: PluginSectionContainer = this.buildNestedContainers(this._data.options, {
      childs: [],
    });

    childs.forEach((c) => this.renderContainer(c, this._container));
    this.applyInteractionEvents();
    this.applyChangeEvents();
  }

  protected buildNestedContainers(
    sortSet: PluginUserOptions,
    parent: PluginSectionContainer,
  ): PluginSectionContainer {
    const searchFor = parent.key;
    const result = sortSet.filter(({ dependsOn }) => dependsOn === searchFor).map(({ key }) => key);
    const nextSortSet = sortSet.filter(({ key }) => !result.includes(key));

    result.forEach((key: string) => {
      const next: PluginSectionContainer = {
        key,
        childs: [],
      };

      if (nextSortSet.length) {
        this.buildNestedContainers(nextSortSet, next);
      }

      parent.childs.push(next);
    });

    parent.childs = parent.childs.sort((l, r) =>
      l.childs.length === r.childs.length ? 0 : l.childs.length > r.childs.length ? 1 : -1,
    );

    return parent;
  }

  protected renderContainer(container: PluginSectionContainer, domContainer: HTMLDivElement): void {
    const settingsObject = this._data.options.find(({ key }) => key === container.key);
    const firstChild = this._data.options.find(
      ({ key }) => key === container.childs[0]?.key,
    ) as PluginUserOptionDep;
    const activator = this.renderOption(settingsObject, domContainer);
    const interactionKey = [this._name, container.key].join('_');

    if (container.childs.length) {
      activator.setAttribute('data-interaction-key', interactionKey);
      activator.setAttribute('data-interaction-action', firstChild.hideOrDisable);

      const childsContainer = this.appendNewElement(domContainer, 'div', {
        attributes: {
          'data-interacted-by': interactionKey,
        },
        style: {
          marginLeft: firstChild.indent ? '2rem' : undefined,
        },
      });

      container.childs.forEach((child) => this.renderContainer(child, childsContainer));
    }
  }

  protected renderOption(
    option: PluginUserOption,
    targetContainer: HTMLDivElement,
  ): HTMLInputElement | HTMLTextAreaElement {
    const name = [this._id, option.key].join('-');
    const value = this._data.plugin.getUsersSetting(option.key);

    switch (option.type) {
      case 'checkbox':
        return this.renderCheckbox(targetContainer, name, option, value as boolean);
      case 'text':
      case 'number':
        return this.renderTextbox(targetContainer, name, option, value as string);
      case 'textarea':
        return this.renderTextarea(targetContainer, name, option, value as string);
      case 'list':
        return this.renderList(targetContainer, name, option, value as string[]);
      default:
        return this.renderHelpText(targetContainer, option.text) as unknown as HTMLInputElement;
        break;
    }
  }

  protected renderCheckbox(
    targetContainer: HTMLDivElement,
    name: string,
    { text, description, key }: PluginUserOption,
    value: boolean,
    extraAttributes: Record<string, string> = {},
  ): HTMLInputElement {
    const checkbox = this.appendNewElement(targetContainer, 'div', { class: ['checkbox'] });
    const input = this.appendNewElement(checkbox, 'input', {
      id: name,
      attributes: {
        name,
        type: 'checkbox',
        'data-key': key,
        ...extraAttributes,
      },
    });

    if (text?.length) {
      this.appendNewElement(checkbox, 'label', {
        innerHTML: text,
        attributes: { for: name },
      });
    }

    if (description?.length) this.renderHelpText(targetContainer, description, '2rem');

    input.checked = value;

    return input;
  }

  protected renderTextbox(
    targetContainer: HTMLDivElement,
    name: string,
    options: PluginUserOption,
    value: string,
    extraAttributes: Record<string, string> = {},
  ): HTMLInputElement {
    const isNumberField = (arg: PluginUserOption): arg is PluginUserOptionNumber =>
      arg.type === 'number';
    const { text, type, description } = options;
    const outerDiv = this.appendNewElement(targetContainer, 'div', { class: ['form-box'] });
    const innerDiv = this.appendNewElement(outerDiv, 'div');

    if (text?.length) {
      this.appendNewElement(innerDiv, 'label', {
        innerHTML: text,
        attributes: { for: name },
      });
    }

    const input = this.appendNewElement(innerDiv, 'input', {
      id: name,
      attributes: {
        name,
        type,
        min: isNumberField(options) ? options.min?.toString() : undefined,
        max: isNumberField(options) ? options.max?.toString() : undefined,
        value: value ?? '',
        placeholder: text?.length ? text : '',
        'data-key': options.key,
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
    targetContainer: HTMLDivElement,
    name: string,
    { text, description, key }: PluginUserOption,
    value: string,
    extraAttributes: Record<string, string> = {},
  ): HTMLTextAreaElement {
    if (text) {
      this.appendNewElement(targetContainer, 'label', {
        innerHTML: text,
        attributes: { for: name },
      });
    }

    const container = this.appendNewElement(targetContainer, 'div', {
      class: ['style-textarea-handle'],
      style: { marginTop: '1rem' },
    });

    const input = this.appendNewElement(container, 'textarea', {
      id: name,
      innerHTML: value,
      attributes: {
        name,
        placeholder: text?.length ? text : '',
        spellcheck: 'false',
        'data-key': key,
        ...extraAttributes,
      },
      style: {
        height: '20rem',
      },
    });

    if (description?.length) this.renderHelpText(targetContainer, description);

    return input;
  }

  /**
   * @TODO: Refactor in own classes (directory `inputs`)
   * @TODO: Make such lists collapsible
   */
  protected renderList(
    targetContainer: HTMLDivElement,
    name: string,
    options: PluginUserOption,
    value: string[],
  ): HTMLInputElement {
    const hiddenInput = this.appendNewElement(targetContainer, 'input', {
      attributes: {
        name,
        type: 'text',
        value: JSON.stringify(value),
        disabled: true,
      },
      style: {
        display: 'none',
      },
    });

    let containerElement: HTMLDivElement | HTMLLabelElement;
    let workingValue: string[] = [...value];

    // eslint-disable-next-line prefer-const
    let addBtn: HTMLInputElement;

    const renderContents = (focusLast: boolean = false): void => {
      const inputElements: HTMLInputElement[] = [];

      workingValue.forEach((v, id) => {
        const c = this.appendNewElement(containerElement, 'div');
        const i = this.appendNewElement(c, 'input', {
          id: `${name}-${id}`,
          attributes: {
            name: `${name}-${id}`,
            value: v,
            type: 'text',
          },
          style: {
            maxWidth: '32rem',
            marginRight: '1rem',
            marginBottom: '.5rem',
          },
        });

        this.appendNewElement(c, 'input', {
          id: `${name}-${id}-rem`,
          attributes: {
            type: 'submit',
            value: '-',
          },
          style: { marginBottom: '.5rem' },
          class: ['outline', 'v1'],
          handler: (e) => {
            e.preventDefault();

            workingValue.splice(id, 1);
            rerenderContents();
          },
        });

        inputElements.push(i);

        i.addEventListener('change', () => (workingValue[id] = i.value));
        i.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();

            if (id === workingValue.length - 1) {
              addBtn.click();
            } else {
              inputElements[id + 1].focus();
            }
          }
        });

        if (focusLast && id === workingValue.length - 1) {
          i.focus();
        }
      });
    };

    const rerenderContents = (): void => {
      containerElement.replaceChildren();

      renderContents(true);
    };

    if (options.text) {
      const l = this.appendNewElement(targetContainer, 'label', {
        innerHTML: options.text,
      });
      this.appendNewElement(l, 'div', { style: { marginBottom: '1rem' } });

      containerElement = this.appendNewElement(l, 'div');
    } else containerElement = this.appendNewElement(targetContainer, 'div');

    renderContents();

    const controlsContainer = this.appendNewElement(targetContainer, 'div');

    addBtn = this.appendNewElement(controlsContainer, 'input', {
      attributes: {
        type: 'submit',
        value: 'Add',
      },
      style: { marginRight: '1rem' },
      class: ['outline'],
      handler: (e) => {
        e.preventDefault();

        workingValue.push('');
        rerenderContents();
      },
    });

    this.appendNewElement(controlsContainer, 'input', {
      attributes: {
        type: 'submit',
        value: 'Apply',
      },
      style: { marginRight: '1rem' },
      class: ['outline', 'v4'],
      handler: (e) => {
        e.preventDefault();

        value = [...workingValue];
        hiddenInput.value = JSON.stringify(value);
      },
    });

    this.appendNewElement(controlsContainer, 'input', {
      attributes: {
        type: 'submit',
        value: 'Reset',
      },
      class: ['outline', 'v3'],
      handler: (e) => {
        e.preventDefault();

        workingValue = [...value];
        rerenderContents();
      },
    });

    if (options.description?.length) this.renderHelpText(targetContainer, options.description);

    return hiddenInput;
  }

  protected renderHelpText(target: HTMLElement, description: string, marginLeft?: string): void {
    this.appendNewElement(target, 'p', {
      innerHTML: description,
      style: {
        opacity: '.8',
        marginLeft,
      },
    });
  }

  protected applyInteractionEvents(): void {
    this.find<'input' | 'textarea'>(this._container, 'input, textarea').forEach((e) => {
      this.addEventListener(e, 'change', () =>
        this._data.plugin.setUsersSetting(
          e.dataset.key,
          e.type === 'checkbox' ? (e as HTMLInputElement).checked : e.value,
        ),
      );
    });
  }

  protected applyChangeEvents(): void {
    this.find<'input'>(this._container, '[data-interaction-key]').forEach((e) => {
      const { interactionKey, interactionAction } = e.dataset;
      const isHide = interactionAction === 'hide';
      const searchKey: string = `[data-interacted-by="${interactionKey}"]${isHide ? '' : ' input'}`;

      const childs = this.find<'div' | 'input'>(this._container, searchKey);
      const callback: () => void = isHide
        ? (): void => childs.forEach((c) => this.hidden(c, !e.checked))
        : (): void => {
            if (e.checked) {
              return childs.forEach((c) => c.removeAttribute('disabled'));
            }
            childs.forEach((c) => c.setAttribute('disabled', ''));
          };

      this.addAndRunEventListener(e, 'change', callback);
    });
  }
}
