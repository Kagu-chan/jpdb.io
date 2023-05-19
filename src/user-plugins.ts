import { JPDBPlugin } from './lib/plugin/jpdb-plugin';
import { TestPlugin } from './plugins/test.plugin';

export const UserPlugins: JPDBPlugin[] = [new TestPlugin()];
