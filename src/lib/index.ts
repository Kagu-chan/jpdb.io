/**
 * Contains the actual user script running modules and allowing settings etc
 */
import { ScriptRunner } from './script-runner';
import './class';

declare global {
  interface Window {
    jpdb: ScriptRunner;
  }

  const jpdb: typeof window.jpdb;
}

window.jpdb = new ScriptRunner();
