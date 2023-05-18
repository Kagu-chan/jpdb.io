import { DefaultPlugins } from './default-plugins';
import { InstanceManager } from './jpdb/instance-manager';
import { Wrapper } from './jpdb/wrapper';
import { PluginStatic } from './types';

export const setup = (plugins: PluginStatic[]): void => {
  InstanceManager.getInstance().pluginRegistry.registerPlugins(...DefaultPlugins, ...plugins);

  (window as unknown as { jpdb: Wrapper }).jpdb = Wrapper.getInstance();
};
