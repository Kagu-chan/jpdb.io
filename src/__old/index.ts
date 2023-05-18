import { TestPlugin } from './plugins/test-plugin';
import { setup } from './setup';
import { PluginStatic } from './types';

const plugins: PluginStatic[] = [TestPlugin];

setup(plugins);
