export enum ModuleUserOptionDependencyAction {
  HIDE = 'hide',
  DISABLE = 'disable',
}

export enum ModuleUserOptionFieldType {
  CHECKBOX = 'checkbox',
  RADIOBUTTON = 'radio',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  LIST = 'list',
  OBJECTLIST = 'objectlist',
}

export type HasChildren = {
  hideOrDisable: `${ModuleUserOptionDependencyAction}`;
  indent?: boolean;
  indentWith?: string;
  children: ModuleUserOptions;
};

export type HasNoChildren = {
  hideOrDisable?: undefined;
  children?: [] | undefined;
};

type ModuleUserOptionBase<T> = {
  key: string;
  text?: string;
  description?: string;
  default?: T;
  type: `${ModuleUserOptionFieldType}`;
} & (HasChildren | HasNoChildren);

type ModuleUserOptionBaseRequired<T> = ModuleUserOptionBase<T> &
  Required<Pick<ModuleUserOptionBase<T>, 'default'>>;

export type ModuleUserOptionCheckbox = ModuleUserOptionBase<boolean> & {
  type: 'checkbox';
};
export type ModuleUserOptionRadioButton = ModuleUserOptionBase<string> & {
  type: 'radio';
  options: object;
  labels: object;
};
export type ModuleUserOptionText = ModuleUserOptionBase<string> & {
  type: 'text';
  placeholder?: string;
};
export type ModuleUserOptionTextarea = ModuleUserOptionBase<string> & {
  type: 'textarea';
  placeholder?: string;
};
export type ModuleUserOptionNumber = ModuleUserOptionBase<number> & {
  type: 'number';
  placeholder?: string;
  min?: number;
  max?: number;
};

export type ModuleUserOptionList = ModuleUserOptionBaseRequired<string[]> & {
  type: 'list';
  text: string;
};

export type ObjectSchemaItem = {
  key: string;
  label: string;
  type: 'number' | 'text';
  min?: number;
  max?: number;
};
export type ObjectSchema = ObjectSchemaItem[];
export type ModuleUserOptionObjectList = ModuleUserOptionBaseRequired<object[]> & {
  type: 'objectlist';
  text: string;
  schema: ObjectSchema;
};

export type ModuleUserOption =
  | ModuleUserOptionCheckbox
  | ModuleUserOptionRadioButton
  | ModuleUserOptionText
  | ModuleUserOptionTextarea
  | ModuleUserOptionNumber
  | ModuleUserOptionList
  | ModuleUserOptionObjectList;
export type ModuleUserOptions = ModuleUserOption[];

export interface IModuleOptions {
  name: string;
  category: string;
  experimental?: boolean;
  displayText?: string;
  description?: string;
  author?: string;
  source?: string;
  options?: ModuleUserOptions;
}
