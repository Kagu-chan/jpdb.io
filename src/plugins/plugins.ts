import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { AutoSortDecksPlugin } from './auto-sort-decks.plugin';
import { CSSPlugin } from './css.plugin';
import { GreetingsPlugin } from './greetings.plugin';
import { ScrollInDecksPlugin } from './scroll-in-decks.plugin';
import { ScrollInSettingsPlugin } from './scroll-in-settings';
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
];
