// import { DOMContainer } from '../../../lib/browser/dom-container';
import { DOMElementTagOptions } from '../../../lib/dom';
import { PluginUserOption, PluginUserOptionDep, PluginUserOptions } from '../../../lib/types';
import { PluginSectionContainer, PluginSettingsSection } from '../user-settings.types';
import { Input } from './inputs/input.class';
import { SectionInputMap } from './section-input-map';
// import { SectionInputMap } from './section-input-map';

export class UserSettingsSection {
  private _elements: PluginSectionContainer[];
  private _id: string;

  constructor(private _name: string, private _data: PluginSettingsSection) {
    this._id = `user-settings-${this._name}`;
    this._elements = this.buildNestedContainers(this._data.options, {
      childs: [],
    }).childs;
  }

  public getControl(): DOMElementTagOptions<'div'> {
    const control: DOMElementTagOptions<'div'> = {
      tag: 'div',
      id: this._id,
      children: this._elements
        .map((c) => this.sectionToTags(c))
        .filter((v) => !!v)
        .flat(),
    };

    if (!this._data.plugin.pluginOptions.canBeDisabled) {
      control.children.unshift({
        tag: 'div',
        innerText: this._data.header,
        class: ['subsection-header'],
        style: { marginTop: '1rem' },
      });
    }

    return control;
  }

  protected sectionToTags(container: PluginSectionContainer): DOMElementTagOptions<any>[] {
    const settingsObject = this._data.options.find(({ key }) => key === container.key);
    const inputElement = this.optionToInput(settingsObject);
    const controls = inputElement.getControls();
    const firstChild = this._data.options.find(
      ({ key }) => key === container.childs[0]?.key,
    ) as PluginUserOptionDep;

    this.addChangeEvent(inputElement, settingsObject.key);

    if (container.childs.length) {
      controls.push({
        tag: 'div',
        children: container.childs.map((c) => this.sectionToTags(c)).flat(),
      });
      //     activator.setInteractable(interactionKey, firstChild.hideOrDisable);

      //     const childsContainer = this.appendNewElement(domContainer, 'div', {
      //       attributes: {
      //         'data-interacted-by': interactionKey,
      //       },
      //       style: {
      //         marginLeft: firstChild.indent ? firstChild.indentWith ?? '2rem' : undefined,
      //       },
      //     });

      //     container.childs.forEach((child) => this.renderContainer(child, childsContainer));
    }

    return controls;
  }

  protected optionToInput(option: PluginUserOption): Input<unknown> {
    const name = [this._id, option.key].join('-');
    const value = this._data.plugin.getUsersSetting(option.key);
    const ctor = SectionInputMap[option.type];

    return ctor ? new ctor(name, option, value) : undefined;
  }

  protected addChangeEvent(container: Input<unknown>, key: string): void {
    const input = container.retrieveInput();
    const oldCb = input.afterrender;

    input.afterrender = (e: HTMLInputElement): void => {
      e.addEventListener('change', () => {
        this._data.plugin.setUsersSetting(key, container.getValue());
      });

      oldCb?.(e);
    };
  }

  // protected renderOptions(): void {
  //   const { childs }: PluginSectionContainer = this.buildNestedContainers(this._data.options, {
  //     childs: [],
  //   });

  //   childs.forEach((c) => this.renderContainer(c, this._container));
  //   this.applyChangeEvents();
  //   this.applyInteractionEvents();
  // }

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

  // protected renderContainer(container: PluginSectionContainer, domContainer: HTMLDivElement): void {
  //   const settingsObject = this._data.options.find(({ key }) => key === container.key);
  //   const firstChild = this._data.options.find(
  //     ({ key }) => key === container.childs[0]?.key,
  //   ) as PluginUserOptionDep;
  //   const activator = this.renderOption(settingsObject, domContainer);
  //   const interactionKey = [this._name, container.key].join('_');

  //   if (container.childs.length) {
  //     activator.setInteractable(interactionKey, firstChild.hideOrDisable);

  //     const childsContainer = this.appendNewElement(domContainer, 'div', {
  //       attributes: {
  //         'data-interacted-by': interactionKey,
  //       },
  //       style: {
  //         marginLeft: firstChild.indent ? firstChild.indentWith ?? '2rem' : undefined,
  //       },
  //     });

  //     container.childs.forEach((child) => this.renderContainer(child, childsContainer));
  //   }

  //   this._inputs.push(activator);
  // }

  // protected renderOption(
  //   _option: PluginUserOption,
  //   _targetContainer: HTMLDivElement,
  // ): Input<unknown, HTMLElement> {
  //   return;
  //   // const name = [this._id, option.key].join('-');
  //   // const value = this._data.plugin.getUsersSetting(option.key);
  //   // const ctor = SectionInputMap[option.type];

  //   // return ctor ? new ctor(targetContainer, name, option, value) : undefined;
  // }

  // protected applyChangeEvents(): void {
  //   // this._inputs.forEach((e: Input<unknown>) => {
  //   //   if (!e || e.isVirtual) return;
  //   //   e.onchange = (val: unknown): void => {
  //   //     this._data.plugin.setUsersSetting(e.key, val);
  //   //   };
  //   // });
  // }

  // protected applyInteractionEvents(): void {
  //   // this.find<'input'>(this._container, '[data-interaction-key]').forEach((e) => {
  //   //   const { interactionKey, interactionAction } = e.dataset;
  //   //   const isHide = interactionAction === 'hide';
  //   //   const searchKey: string = `[data-interacted-by="${interactionKey}"]${isHide ? '' : ' input'}`;
  //   //   const childs = this.find<'div' | 'input'>(this._container, searchKey);
  //   //   const callback: () => void = isHide
  //   //     ? (): void => childs.forEach((c) => this.hidden(c, !e.checked))
  //   //     : (): void => {
  //   //         if (e.checked) {
  //   //           return childs.forEach((c) => c.removeAttribute('disabled'));
  //   //         }
  //   //         childs.forEach((c) => c.setAttribute('disabled', ''));
  //   //       };
  //   //   this.addAndRunEventListener(e, 'change', callback);
  //   // });
  // }
}
