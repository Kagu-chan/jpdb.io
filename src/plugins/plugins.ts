import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { AutoSortDecksPlugin } from './auto-sort-decks.plugin';
import { ScrollInSettingsPlugin } from './scroll-in-settings';
import { CSSPlugin } from './css.plugin';
import { GreetingsPlugin } from './greetings.plugin';
import { UserCSSPlugin } from './user-css.plugin';
import { UserSettingsPlugin } from './user-settings/user-settings.plugin';

export const Plugins: JPDBPlugin[] = [
  new CSSPlugin(),
  new GreetingsPlugin(),
  new UserSettingsPlugin(),
  new UserCSSPlugin(),
  new ScrollInSettingsPlugin(),
  new AutoSortDecksPlugin(),
];
