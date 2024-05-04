import { ModuleUserOptionDescription } from '../../module-options.type';
import { Renderer } from './lib/_renderer';

export class DescriptionRenderer extends Renderer<ModuleUserOptionDescription, never> {
  public render(container: HTMLDivElement): void {
    if (!this._options.collapsible) {
      document.jpdb.appendElement(
        container,
        document.jpdb.createElement('p', { innerHTML: this._options.text }),
      );

      return;
    }

    const stateKey: string = `collapsible-${this._options.key}`;
    const accordionContent = document.util.container([], { class: [] });

    document.util.appendHelpText(accordionContent, this._options.description);

    const accordion = document.jpdb.appendElement(
      container,
      document.util.collapsible([accordionContent], {
        text: this._options.text,
        open: jpdb.state.readState(stateKey, false),
      }),
    );

    accordion.addEventListener('toggle', () => {
      jpdb.state.writeState(stateKey, accordion.open);
    });
  }
}
