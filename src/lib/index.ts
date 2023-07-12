/**
 * Contains the actual user script running modules and allowing settings etc
 */

import { ScriptRunner } from './script-runner';

declare global {
  interface Window {
    jpdb: ScriptRunner;
  }
}

window.jpdb = new ScriptRunner();
