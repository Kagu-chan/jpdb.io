export type PluginUserOptionDepAction = 'hide' | 'disable';
export type PluginUserOptionNoDep = {
  dependsOn?: undefined;
};
export type PluginUserOptionDep = {
  dependsOn: string;
  indent: boolean;
  hideOrDisable: PluginUserOptionDepAction;
};
export type PluginUserOptionDependsOn = PluginUserOptionNoDep | PluginUserOptionDep;

type PluginUserOptionBase<T> = PluginUserOptionDependsOn & {
  key: string;
  text?: string;
  description?: string;
  default?: T;
};
type PluginUserOptionBaseRequired<T> = PluginUserOptionBase<T> &
  Required<Pick<PluginUserOptionBase<T>, 'default'>>;

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

export type PluginUserOptionList = PluginUserOptionBaseRequired<string[]> & {
  type: 'list';
  text: string;
};

export type ObjectSchema = Array<{
  key: string;
  label: string;
  type: 'number' | 'string';
  min?: number;
  max?: number;
}>;
export type PluginUserOptionObjectList = PluginUserOptionBaseRequired<object[]> & {
  type: 'objectlist';
  text: string;
  schema: ObjectSchema;
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
  | PluginUserOptionNumber
  | PluginUserOptionList
  | PluginUserOptionObjectList;
export type PluginUserOptions = PluginUserOption[];
