import { JPDBPlugin } from '../../lib/plugin/jpdb-plugin';
import { PluginUserOption } from '../../lib/types';

export type PluginSettingsSection = {
  plugin: JPDBPlugin;
  header: string;
  options: PluginUserOption[];
};

export type PluginSectionContainer = {
  key?: string;
  childs: PluginSectionContainer[];
};
