/**
 * Contains the actual user script running modules and allowing settings etc
 */

import { ScriptRunner } from './script-runner';
import { ModuleUserOptionFieldType as M } from './user-settings/ui/module-settings/activatable.interface';

declare global {
  interface Window {
    jpdb: ScriptRunner;
    ModuleUserOptionFieldType: typeof M;
  }

  const jpdb: typeof window.jpdb;
  const ModuleUserOptionFieldType: typeof window.ModuleUserOptionFieldType;
}

window.jpdb = new ScriptRunner();
window.ModuleUserOptionFieldType = M;
