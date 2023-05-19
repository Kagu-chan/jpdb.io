import { Globals } from './lib/globals';
import { UserPlugins } from './user-plugins';

declare global {
  const virtual_refresh: () => void;
}

Globals.makePublic('jpdb');

Globals.scriptRunner.registerDefaults();
Globals.pluginManager.registerPlugins(...UserPlugins);
Globals.pluginManager.loadAll();

Globals.scriptRunner.run();
