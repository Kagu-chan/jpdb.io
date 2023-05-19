import { JPDBPlugin } from '../../lib/plugin/jpdb-plugin';
import { PluginUserOption } from '../../lib/types';

export type AppliedUserOption = Pick<PluginUserOption, 'text' | 'key' | 'type' | 'description'>;
export type PluginSettingsSection = {
  plugin: JPDBPlugin;
  header: string;
  options: AppliedUserOption[];
};
