import { JPDBPlugin } from '../plugin/jpdb-plugin';
import { AutoSortDecksPlugin } from './auto-sort-decks.plugin';
import { CustomLinksPlugin } from './custom-links.plugin';
import { MoveCardPlugin } from './move-card.plugin';
import { UserSettingsPlugin } from './user-settings/user-settings.plugin';

export const Plugins: JPDBPlugin[] = [
  new UserSettingsPlugin(),
  new AutoSortDecksPlugin(),
  new MoveCardPlugin(),
  new CustomLinksPlugin(),
];
