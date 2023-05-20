export type PluginUserOptionNoDep = {
  dependsOn?: undefined;
};
export type PluginUserOptionDep = {
  dependsOn: string;
  indent: boolean;
  hideOrDisable: 'hide' | 'disable';
};
export type PluginUserOptionDependsOn = PluginUserOptionNoDep | PluginUserOptionDep;

type PluginUserOptionBase<T> = PluginUserOptionDependsOn & {
  key: string;
  text?: string;
  description?: string;
  default?: T;
};

export type PluginUserOptionCheckbox = PluginUserOptionBase<boolean> & {
  type: 'checkbox';
};
export type PluginUserOptionText = PluginUserOptionBase<string> & {
  type: 'text';
  placeholder?: string;
};
export type PluginUserOptionTextarea = PluginUserOptionBase<string> & {
  type: 'textarea';
  placeholder?: string;
};
export type PluginUserOptionNumber = PluginUserOptionBase<number> & {
  type: 'number';
  placeholder?: string;
  min?: number;
  max?: number;
};

export type PluginUserOptionEnabled = PluginUserOptionNoDep & {
  key: 'enabled';
  text: string;
  type: 'checkbox';
  default: boolean;
  description: undefined;
};

export type PluginUserOption =
  | PluginUserOptionCheckbox
  | PluginUserOptionText
  | PluginUserOptionTextarea
  | PluginUserOptionNumber;
export type PluginUserOptions = PluginUserOption[];
