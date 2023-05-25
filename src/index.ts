import { Globals } from './lib/globals';
import { UserPlugins } from './user-plugins/index';

declare global {
  const virtual_refresh: () => void;

  const xhr: (
    method: Parameters<XMLHttpRequest['open']>[0],
    url: Parameters<XMLHttpRequest['open']>[1],
    payload: object,
    callback: (data: null | XMLHttpRequest) => void,
  ) => void;
}

Globals.makePublic('jpdb');

Globals.scriptRunner.registerDefaults();
Globals.pluginManager.registerPlugins(...UserPlugins);
Globals.pluginManager.loadAll();
Globals.pluginManager.abandonDeadData();

Globals.scriptRunner.run();
