import { DOMContainer } from '../../lib/browser/dom-container';
import { Globals } from '../../lib/globals';
import { JPDBPlugin } from '../../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../../lib/types';
import { CSSPlugin } from '../css/css.plugin';
import { UserSettingsPluginAPI } from './user-settings-plugin.api';
import { UserSettingsContainer } from './user-settings.container';
import { PluginSettingsSection } from './user-settings.types';

const collapsibleCSS = `
.user-settings .word-list p ul {
  margin-bottom: 0;
}

.user-settings .word-list {
  padding: 1rem 0 0;
}

.user-settings .word-list p {
  margin: 1rem 0 0;
}

.user-settings .controls-list input {
  margin: .5rem .5rem 0 0;
}

.user-settings .input-list .input-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.user-settings .input-list input[type=text],
.user-settings .input-list input[type=number] {
  margin: 0 1rem .5rem 0;
  padding: 0 1rem;
}

.user-settings .input-list input[type=submit] {
  margin-bottom: .5rem;
}

.user-settings .deck-sidebar {
  display: inline-flex;
  padding-left: 0;
}

.user-settings .arrow-control {
  border: 0;
  background: none;
  box-shadow: none;
  margin-bottom: 0;
  height: 22px;
  padding: 0 1.4rem 0 .5rem;
}

.user-settings .arrow-control:hover {
  border: 0;
  transform: none;
  box-shadow: none;
  color: var(--button-hover-border-color);
}

.user-settings .input-list .input-item:first-of-type .arrow-control.up { opacity: 0; }
.user-settings .input-list .input-item:last-of-type .arrow-control.down { opacity: 0; }
`;

export class UserSettingsPlugin extends JPDBPlugin {
  protected domElement: HTMLDivElement;
  protected sections = new Map<string, PluginSettingsSection>();

  protected dom: DOMContainer;
  protected api: UserSettingsPluginAPI;

  protected _pluginOptions: PluginOptions = {
    name: 'User-Settings',
    activeAt: '/settings',
    canBeDisabled: false,
    runAgain: false,
  };

  protected run(): void {
    this.api = new UserSettingsPluginAPI();
    this.dom = new UserSettingsContainer(this.api);

    this.api.buildMaps();
    this.dom.render();

    Globals.pluginManager.get(CSSPlugin).register(UserSettingsPlugin.name, collapsibleCSS);
  }
}
