import { JPDBPlugin } from '../../lib/plugin/jpdb-plugin';
import { PluginUserOption } from '../../lib/types';

export type AppliedUserOption = Pick<PluginUserOption, 'text' | 'key' | 'type'>;
export type PluginSettingsSection = {
  plugin: JPDBPlugin;
  header: string;
  options: AppliedUserOption[];
};
