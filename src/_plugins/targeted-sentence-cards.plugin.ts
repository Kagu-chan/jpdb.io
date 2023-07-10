import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../lib/types';

export class TargetedSentenceCardsPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: ['/review'],
    canBeDisabled: true,
    name: 'Targeted sentence cards',
    description:
      'Remove the target word from reviews, thus turning them into targeted sentence cards',
    runAgain: true,
  };

  public run(): void {
    if (document.jpdb.findElement('.kind')?.innerText === 'Vocabulary') {
      document.jpdb.hideElement('.answer-box .plain');
    }
  }
}
