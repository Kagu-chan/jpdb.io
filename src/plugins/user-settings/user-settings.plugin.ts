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

.user-settings .input-list input[type=text],
.user-settings .input-list input[type=number] {
  width: calc(100% - 123px);
  margin: 0 1rem .5rem 0;
  padding: 0 1rem;
}

.user-settings .input-list input[type=submit] {
  margin-bottom: .5rem;
}

.user-settings .object-list .float-container {
  width: calc(100% - 73px);
  display: inline-flex;
}

.user-settings .object-list .float-container.labels {
  justify-content: space-around;
}

.user-settings .object-list .float-container input[type=text],
.user-settings .object-list .float-container input[type=number] {
  width: 100%;
}
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
