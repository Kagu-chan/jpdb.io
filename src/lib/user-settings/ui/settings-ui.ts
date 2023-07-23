import { container } from '../../elements/container';
import { InfoSection } from './info-section/info-section';
import { ModuleSettingsContainer, ModuleSettingsOptions } from './module-settings/module-settings';

type SettingsCategory = {
  dom: HTMLElement;
  spacer: HTMLDivElement;
  map: Map<string, ModuleSettingsContainer>;
};

export class SettingsUI {
  public get id(): string {
    return this._modules.id;
  }

  private _categories = new Map<string, SettingsCategory>();
  private _experimentalCategories = new Map<string, SettingsCategory>();

  private _modules = document.jpdb.appendElement('.container.bugfix', {
    tag: 'h4',
    class: ['module-settings'],
    innerText: 'Extension Settings',
    style: {
      textAlign: 'center',
      opacity: '.85',
    },
  });
  private _experimentalModules = document.jpdb.adjacentElement('.module-settings', 'afterend', {
    tag: 'h4',
    class: ['experimental-settings'],
    innerText: 'Experimental extension Settings',
    style: {
      textAlign: 'center',
      opacity: '.85',
    },
  });

  private rootModules = {
    show: this._modules,
    cat: this._categories,
  };
  private rootExperimental = {
    show: this._experimentalModules,
    cat: this._experimentalCategories,
  };

  // private _infos: InfoSection = new InfoSection();

  constructor() {
    new InfoSection();
  }

  public registerConfigurable(options: ModuleSettingsOptions): void {
    jpdb.css.add({
      key: 'settings',
      css: __load_css('./src/lib/user-settings/ui/settings-ui.css'),
    });

    const { show, cat } = options.experimental ? this.rootExperimental : this.rootModules;

    document.jpdb.showElement(show);

    if (!cat.has(options.category)) {
      cat.set(options.category, { dom: undefined, spacer: undefined, map: new Map() });

      this.renderCategories(show, cat);
    }

    const { map, dom, spacer } = cat.get(options.category);
    const section = new ModuleSettingsContainer(dom, options);

    map.set(options.name, section);

    cat.set(options.category, { map, spacer, dom: section.rendered });
  }

  private renderCategories(prev: HTMLElement, cat: Map<string, SettingsCategory>): void {
    let previousItem: HTMLElement = prev;
    let id: number = 0;

    Array.from(cat.keys())
      .sort()
      .forEach((category: string) => {
        const data = cat.get(category);

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
