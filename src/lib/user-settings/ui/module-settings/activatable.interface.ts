export enum ModuleUserOptionDependencyAction {
  HIDE = 'hide',
  DISABLE = 'disable',
}

export enum ModuleUserOptionFieldType {
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

export type ModuleUserOptionNoDep = {
  dependsOn?: undefined;
};
export type ModuleUserOptionDep = {
  dependsOn: string;
  indent: boolean;
  hideOrDisable: ModuleUserOptionDependencyAction;
  indentWith?: string;
};
export type ModuleUserOptionDependsOn = ModuleUserOptionNoDep | ModuleUserOptionDep;

type ModuleUserOptionBase<T> = ModuleUserOptionDependsOn & {
  key: string;
  text?: string;
  description?: string;
  default?: T;
};
type ModuleUserOptionBaseRequired<T> = ModuleUserOptionBase<T> &
  Required<Pick<ModuleUserOptionBase<T>, 'default'>>;

export type ModuleUserOptionHeader = ModuleUserOptionBase<void> & {
  type: ModuleUserOptionFieldType.HEADER;
};
export type ModuleUserOptionDivider = ModuleUserOptionBase<void> & {
  type: ModuleUserOptionFieldType.DIVIDER;
};
export type ModuleUserOptionCheckbox = ModuleUserOptionBase<boolean> & {
  type: ModuleUserOptionFieldType.CHECKBOX;
};
export type ModuleUserOptionRadioButton = ModuleUserOptionBase<string> & {
  type: ModuleUserOptionFieldType.RADIOBUTTON;
  options: object;
  labels: object;
};
export type ModuleUserOptionText = ModuleUserOptionBase<string> & {
  type: ModuleUserOptionFieldType.TEXT;
  placeholder?: string;
};
export type ModuleUserOptionTextarea = ModuleUserOptionBase<string> & {
  type: ModuleUserOptionFieldType.TEXTAREA;
  placeholder?: string;
};
export type ModuleUserOptionNumber = ModuleUserOptionBase<number> & {
  type: ModuleUserOptionFieldType.NUMBER;
  placeholder?: string;
  min?: number;
  max?: number;
};

export type ModuleUserOptionList = ModuleUserOptionBaseRequired<string[]> & {
  type: ModuleUserOptionFieldType.LIST;
  text: string;
};

export type ObjectSchemaItem = {
  key: string;
  label: string;
  type: ModuleUserOptionFieldType.NUMBER | ModuleUserOptionFieldType.TEXT;
  min?: number;
  max?: number;
};
export type ObjectSchema = ObjectSchemaItem[];
export type ModuleUserOptionObjectList = ModuleUserOptionBaseRequired<object[]> & {
  type: ModuleUserOptionFieldType.OBJECTLIST;
  text: string;
  schema: ObjectSchema;
};

export type ModuleUserOptionEnabled = ModuleUserOptionNoDep & {
  key: 'enabled';
  text: string;
  type: ModuleUserOptionFieldType.CHECKBOX;
  default: boolean;
  description: undefined;
};

export type ModuleUserOption =
  | ModuleUserOptionHeader
  | ModuleUserOptionDivider
  | ModuleUserOptionCheckbox
  | ModuleUserOptionRadioButton
  | ModuleUserOptionText
  | ModuleUserOptionTextarea
  | ModuleUserOptionNumber
  | ModuleUserOptionList
  | ModuleUserOptionObjectList;
export type ModuleUserOptions = ModuleUserOption[];

export interface IActivatable {
  name: string;
  category: string;
  experimental?: boolean;
  displayText?: string;
  description?: string;
  author?: string;
  source?: string;
  children?: ModuleUserOptions;
}
