import { JPDBPlugin } from '../../plugin/jpdb-plugin';
import { PluginUserOption } from '../../plugin/types/plugin-user-options';

export interface PluginSettingsSection {
  plugin: JPDBPlugin;
  header: string;
  options: PluginUserOption[];
}

export interface PluginSectionContainer {
  key?: string;
  childs: PluginSectionContainer[];
}
