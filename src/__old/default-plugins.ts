import { CSSInjectorPlugin } from './plugins/css-injector/css-injector.plugin';
import { HelloWorldPlugin } from './plugins/hello-word/hello-world.plugin';
import { PluginStatic } from './types';

export const DefaultPlugins: PluginStatic[] = [HelloWorldPlugin, CSSInjectorPlugin];
