import { DOMContainer } from '../../lib/browser/dom-container';
import { JPDBPlugin } from '../../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../../lib/types';
import { UserSettingsPluginAPI } from './user-settings-plugin.api';
import { UserSettingsContainer } from './user-settings.container';
import { PluginSettingsSection } from './user-settings.types';

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
  }
}
