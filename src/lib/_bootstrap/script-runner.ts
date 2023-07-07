import { ScriptRunner } from '../script-runner';

declare global {
  interface Window {
    jpdbScriptRunner: ScriptRunner;
  }

  const jpdbScriptRunner: typeof window.jpdbScriptRunner;
}

window.jpdbScriptRunner = new ScriptRunner();
