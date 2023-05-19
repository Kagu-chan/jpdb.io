import { JPDBPlugin } from './lib/plugin/jpdb-plugin';
import { TestPlugin } from './user-plugins/test.plugin';

export const UserPlugins: JPDBPlugin[] = [new TestPlugin()];
