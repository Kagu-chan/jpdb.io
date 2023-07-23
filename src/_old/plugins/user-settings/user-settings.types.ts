import { JPDBPlugin } from '../../plugin/jpdb-plugin';
import { PluginUserOption } from '../../plugin/types/plugin-user-options';

export type PluginSettingsSection = {
  plugin: JPDBPlugin;
  header: string;
  options: PluginUserOption[];
};

export type PluginSectionContainer = {
  key?: string;
  childs: PluginSectionContainer[];
};
