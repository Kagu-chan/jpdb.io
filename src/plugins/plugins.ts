import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { AutoSortDecksPlugin } from './auto-sort-decks.plugin';
import { BackToTopPlugin } from './back-to-top.plugin';
import { CSSPlugin } from './css.plugin';
import { GreetingsPlugin } from './greetings.plugin';
import { UserCSSPlugin } from './user-css.plugin';
import { UserSettingsPlugin } from './user-settings/user-settings.plugin';

export const Plugins: JPDBPlugin[] = [
  new CSSPlugin(),
  new GreetingsPlugin(),
  new UserSettingsPlugin(),
  new UserCSSPlugin(),
  new BackToTopPlugin(),
  new AutoSortDecksPlugin(),
];
