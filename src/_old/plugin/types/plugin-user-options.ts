export enum PluginUserOptionDependencyAction {
  HIDE = 'hide',
  DISABLE = 'disable',
}

export enum PluginUserOptionFieldType {
  HEADER = 'header',
  DIVIDER = 'divider',
  CHECKBOX = 'checkbox',
  RADIOBUTTON = 'radio',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  LIST = 'list',
  OBJECTLIST = 'objectlist',
}

export interface PluginUserOptionNoDep {
  dependsOn?: undefined;
}
export interface PluginUserOptionDep {
  dependsOn: string;
  indent: boolean;
  hideOrDisable: PluginUserOptionDependencyAction;
  indentWith?: string;
}
export type PluginUserOptionDependsOn = PluginUserOptionNoDep | PluginUserOptionDep;

type PluginUserOptionBase<T> = PluginUserOptionDependsOn & {
  key: string;
  text?: string;
  description?: string;
  default?: T;
};
type PluginUserOptionBaseRequired<T> = PluginUserOptionBase<T> &
  Required<Pick<PluginUserOptionBase<T>, 'default'>>;

export type PluginUserOptionHeader = PluginUserOptionBase<void> & {
  type: PluginUserOptionFieldType.HEADER;
};
export type PluginUserOptionDivider = PluginUserOptionBase<void> & {
  type: PluginUserOptionFieldType.DIVIDER;
};
export type PluginUserOptionCheckbox = PluginUserOptionBase<boolean> & {
  type: PluginUserOptionFieldType.CHECKBOX;
};
export type PluginUserOptionRadioButton = PluginUserOptionBase<string> & {
  type: PluginUserOptionFieldType.RADIOBUTTON;
  options: object;
  labels: object;
};
export type PluginUserOptionText = PluginUserOptionBase<string> & {
  type: PluginUserOptionFieldType.TEXT;
  placeholder?: string;
};
export type PluginUserOptionTextarea = PluginUserOptionBase<string> & {
  type: PluginUserOptionFieldType.TEXTAREA;
  placeholder?: string;
};
export type PluginUserOptionNumber = PluginUserOptionBase<number> & {
  type: PluginUserOptionFieldType.NUMBER;
  placeholder?: string;
  min?: number;
  max?: number;
};

export type PluginUserOptionList = PluginUserOptionBaseRequired<string[]> & {
  type: PluginUserOptionFieldType.LIST;
  text: string;
};

export interface ObjectSchemaItem {
  key: string;
  label: string;
  type: PluginUserOptionFieldType.NUMBER | PluginUserOptionFieldType.TEXT;
  min?: number;
  max?: number;
}
export type ObjectSchema = ObjectSchemaItem[];
export type PluginUserOptionObjectList = PluginUserOptionBaseRequired<object[]> & {
  type: PluginUserOptionFieldType.OBJECTLIST;
  text: string;
  schema: ObjectSchema;
};

export type PluginUserOptionEnabled = PluginUserOptionNoDep & {
  key: 'enabled';
  text: string;
  type: PluginUserOptionFieldType.CHECKBOX;
  default: boolean;
  description: undefined;
};

export type PluginUserOption =
  | PluginUserOptionHeader
  | PluginUserOptionDivider
  | PluginUserOptionCheckbox
  | PluginUserOptionRadioButton
  | PluginUserOptionText
  | PluginUserOptionTextarea
  | PluginUserOptionNumber
  | PluginUserOptionList
  | PluginUserOptionObjectList;
export type PluginUserOptions = PluginUserOption[];
