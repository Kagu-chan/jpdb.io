import { ScriptRunner } from './lib/script-runner';

declare global {
  const virtual_refresh: () => void;

  const xhr: (
    method: Parameters<XMLHttpRequest['open']>[0],
    url: Parameters<XMLHttpRequest['open']>[1],
    payload: object,
    callback: (data: null | XMLHttpRequest) => void,
  ) => void;

  interface Window {
    jpdbScriptRunner: ScriptRunner;
  }

  interface Document {
    _id: number;
  }

  const jpdbScriptRunner: ScriptRunner;
}

document._id = 0;
window.jpdbScriptRunner = new ScriptRunner();

// Globals.scriptRunner.registerDefaults();
// Globals.pluginManager.registerPlugins(...UserPlugins);
// Globals.pluginManager.loadAll();
// Globals.pluginManager.abandonDeadData();

// Globals.scriptRunner.run();
