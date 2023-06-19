import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { AutoSortDecksPlugin } from './auto-sort-decks.plugin';
import { CSSPlugin } from './css/css.plugin';
import { CustomLinksPlugin } from './custom-links.plugin';
import { GreetingsPlugin } from './greetings.plugin';
import { HideDeckNumbersPlugin } from './hide-deck-numbers.plugin';
import { LearningStatsPlugin } from './learning-stats.plugin';
import { MoveCardPlugin } from './move-card.plugin';
import { ScrollInDecksPlugin } from './scroll-in-decks.plugin';
import { ScrollInSettingsPlugin } from './scroll-in-settings.plugin';
import { UserCSSPlugin } from './user-css.plugin';
import { UserSettingsPlugin } from './user-settings/user-settings.plugin';

export const Plugins: JPDBPlugin[] = [
  new CSSPlugin(),
  new GreetingsPlugin(),
  new UserSettingsPlugin(),
  new UserCSSPlugin(),
  new ScrollInSettingsPlugin(),
  new ScrollInDecksPlugin(),
  new AutoSortDecksPlugin(),
  new HideDeckNumbersPlugin(),
  new MoveCardPlugin(),
  new LearningStatsPlugin(),
  new CustomLinksPlugin(),
];
