import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { AutoSortDecksPlugin } from './auto-sort-decks.plugin';
import { CustomLinksPlugin } from './custom-links.plugin';
import { LearningStatsPlugin } from './learning-stats.plugin';
import { MoveCardPlugin } from './move-card.plugin';
import { ScrollControlsPlugin } from './scroll-controls.plugin';
import { UserCSSPlugin } from './user-css.plugin';
import { UserSettingsPlugin } from './user-settings/user-settings.plugin';

export const Plugins: JPDBPlugin[] = [
  new UserSettingsPlugin(),
  new UserCSSPlugin(),
  new AutoSortDecksPlugin(),
  new MoveCardPlugin(),
  new LearningStatsPlugin(),
  new CustomLinksPlugin(),
  new ScrollControlsPlugin(),
];
