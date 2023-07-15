import { container } from '../../elements/container';
import { InfoSection } from './info-section/info-section';
import { ModuleSettingsContainer, ModuleSettingsOptions } from './module-settings/module-settings';

export class SettingsUI {
  public get id(): string {
    return this._modules.id;
  }

  private _categories = new Map<
    string,
    { dom: HTMLElement; spacer: HTMLDivElement; map: Map<string, ModuleSettingsContainer> }
  >();
  private _modules = document.jpdb.appendElement('.container.bugfix', {
    tag: 'h4',
    innerText: 'Extension Settings',
    style: {
      textAlign: 'center',
      opacity: '.85',
    },
  });
  private _infos: InfoSection = new InfoSection();

  public registerConfigurable(options: ModuleSettingsOptions): void {
    document.jpdb.showElement(this._modules);
    jpdb.css.add({
      key: 'settings',
      css: '.s-spacer { padding-bottom: 1.5rem; } .s-spacer-1 { display: none }',
    });

    if (!this._categories.has(options.category)) {
      this._categories.set(options.category, { dom: undefined, spacer: undefined, map: new Map() });

      this.renderCategories();
    }

    const { map, dom, spacer } = this._categories.get(options.category);
    const section = new ModuleSettingsContainer(dom, options);

    map.set(options.name, section);

    this._categories.set(options.category, { map, spacer, dom: section.rendered });
  }

  private renderCategories(): void {
    let previousItem: HTMLElement = this._modules;
    let id: number = 0;

    Array.from(this._categories.keys())
      .sort()
      .forEach((category: string) => {
        const data = this._categories.get(category);

        if (!data.dom) {
          data.spacer = document.jpdb.createElement({ tag: 'div', class: ['s-spacer'] });
          data.dom = container([
            data.spacer,
            {
              tag: 'h6',
              innerText: category,
            },
          ]);

          document.jpdb.adjacentElement(previousItem, 'afterend', data.dom);
        }

        data.spacer.classList.value = `s-spacer s-spacer-${++id}`;

        previousItem = data.dom;
      });
  }
}
