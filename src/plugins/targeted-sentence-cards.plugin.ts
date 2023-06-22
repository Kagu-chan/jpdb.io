import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../lib/types';

export class TargetedSentenceCardsPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: ['/review'],
    canBeDisabled: true,
    name: 'Targeted sentence cards',
    runAgain: true,
  };

  public run(): void {
    const kindContainer = this._dom.findOne('.kind');
    const plainContainer = this._dom.findOne('.answer-box .plain');

    if (!kindContainer || kindContainer.innerText !== 'Vocabulary') return;

    plainContainer.style.display = 'none';
  }
}
