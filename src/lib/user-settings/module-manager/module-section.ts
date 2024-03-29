import { ModuleOptions } from './module-options';
import { IModuleOptions, ModuleUserOption, ModuleUserOptions } from './module-options.type';

export class ModuleSection {
  private _categories = new Map<string, HTMLDivElement>();
  private _titleNode: HTMLHeadingElement;

  constructor(
    private _title: string,
    private _container: HTMLDivElement,
  ) {
    this._titleNode = document.jpdb.appendElement(this._container, {
      tag: 'h4',
      innerText: this._title,
      style: {
        textAlign: 'center',
        opacity: '.85',
      },
    });
  }

  public register(options: IModuleOptions): void {
    this.walkAndInitOptions(options.name, options.options);

    const container = this.getCategory(options.category);
    const renderer = new ModuleOptions(options);

    document.jpdb.appendElement(container, renderer.getEl());
  }

  private getCategory(category: string): HTMLDivElement {
    if (!this._categories.has(category)) {
      const cat = document.util.container([{ tag: 'h6', innerText: category }], {
        class: 'user-settings',
      });

      this._categories.set(category, cat);
      this.renderCategory(category, cat);
    }

    return this._categories.get(category)!;
  }

  private renderCategory(newName: string, item: HTMLDivElement): void {
    const sortedCategories = Array.from(this._categories.keys()).sort();
    const ownIndex = sortedCategories.indexOf(newName);
    const previousIndex = ownIndex - 1;

    const previousItem = previousIndex >= 0 && sortedCategories[previousIndex];
    const node = previousItem ? this._categories.get(previousItem)! : this._titleNode;

    document.jpdb.adjacentElement(node, 'afterend', item);
  }

  private walkAndInitOptions(name: string, options?: ModuleUserOptions): void {
    options?.filter(Boolean).forEach((option: ModuleUserOption) => {
      jpdb.settings.persistence.getModuleOption(name, option.key, option.default);

      if (option.children?.length) {
        this.walkAndInitOptions(name, option.children);
      }
    });
  }
}
