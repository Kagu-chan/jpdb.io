import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { GreetingsPlugin } from './greetings.plugin';
import { UserCSSPlugin } from './user-css.plugin';
import { UserSettingsPlugin } from './user-settings/user-settings.plugin';

export const Plugins: JPDBPlugin[] = [
  new GreetingsPlugin(),
  new UserSettingsPlugin(),
  new UserCSSPlugin(),
];
