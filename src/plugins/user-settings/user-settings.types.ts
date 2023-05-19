import { PluginUserOption } from '../../lib/types';

export type AppliedUserOption = Omit<PluginUserOption, 'default'>;
export type PluginSettingsSection = { header: string; options: AppliedUserOption[] };
