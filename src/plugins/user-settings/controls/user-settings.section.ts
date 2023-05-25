import { DOMContainer } from '../../../lib/browser/dom-container';
import { PluginUserOption, PluginUserOptionDep, PluginUserOptions } from '../../../lib/types';
import { UserSettingsContainer } from '../user-settings.container';
import { PluginSectionContainer, PluginSettingsSection } from '../user-settings.types';
import { CheckBoxInput } from './inputs/checkbox.input';
import { Input } from './inputs/input.class';
import { NumberInput } from './inputs/number.input';
import { ObjectListInput } from './inputs/object-list.input';
import { TextAreaInput } from './inputs/textarea.input';
import { TextBoxInput } from './inputs/textbox.input';
import { WordListInput } from './inputs/word-list.input';

export class UserSettingsSection extends DOMContainer {
  private _container: HTMLDivElement;
  private _inputs: Input<unknown, HTMLElement>[] = [];

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
    this.applyChangeEvents();
    this.applyInteractionEvents();
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
      activator.setInteractable(interactionKey, firstChild.hideOrDisable);

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

    this._inputs.push(activator);
  }

  protected renderOption(
    option: PluginUserOption,
    targetContainer: HTMLDivElement,
  ): Input<unknown, HTMLElement> {
    const name = [this._id, option.key].join('-');
    const value = this._data.plugin.getUsersSetting(option.key);

    switch (option.type) {
      case 'text':
        return new TextBoxInput(targetContainer, name, option, value as string);
      case 'number':
        return new NumberInput(targetContainer, name, option, value as number);
      case 'checkbox':
        return new CheckBoxInput(targetContainer, name, option, value as boolean);
      case 'textarea':
        return new TextAreaInput(targetContainer, name, option, value as string);
      case 'list':
        return new WordListInput(targetContainer, name, option, value as string[]);
      case 'objectlist':
        return new ObjectListInput(
          targetContainer,
          name,
          option,
          value as Record<string, string | number>[],
        );
      default:
        break;
    }
  }

  protected applyChangeEvents(): void {
    this._inputs.forEach((e: Input<unknown, HTMLElement>) => {
      if (!e) return;

      e.onchange = (val: unknown): void => {
        this._data.plugin.setUsersSetting(e.key, val);
      };
    });
  }

  protected applyInteractionEvents(): void {
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
