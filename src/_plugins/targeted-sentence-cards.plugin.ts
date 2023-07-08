import { findElement, hideElement } from '../lib/dom';
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
    if (findElement('.kind')?.innerText === 'Vocabulary') {
      hideElement('.answer-box .plain');
    }
  }
}
