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
  STRINGLIST = 'stringlist',
  NUMBERLIST = 'numberlist',
  OBJECTLIST = 'objectlist',
  DESCRIPTION = 'description',
}

export interface HasChildren {
  hideOrDisable: `${ModuleUserOptionDependencyAction}`;
  indent?: boolean;
  indentWith?: string;
  children: ModuleUserOptions;
}

export interface HasNoChildren {
  hideOrDisable?: undefined;
  children?: [] | undefined;
}

interface ModuleUserOptionRoot {
  key: string;
  type: `${ModuleUserOptionFieldType}`;
}
type ModuleUserOptionBase<T> = ModuleUserOptionRoot & {
  text?: string;
  description?: string;
  default: T;
} & (HasChildren | HasNoChildren);

export type ModuleUserOptionDescription = ModuleUserOptionRoot & {
  type: `${ModuleUserOptionFieldType.DESCRIPTION}`;
  text: string;
  description?: string;
  collapsible?: boolean;
  default?: never;
} & HasNoChildren;
export type ModuleUserOptionCheckbox = ModuleUserOptionBase<boolean> & {
  type: `${ModuleUserOptionFieldType.CHECKBOX}`;
};
export type ModuleUserOptionRadioButton = ModuleUserOptionBase<string> & {
  type: `${ModuleUserOptionFieldType.RADIOBUTTON}`;
  options: object;
  labels: object;
};
export type ModuleUserOptionText = ModuleUserOptionBase<string> & {
  type: `${ModuleUserOptionFieldType.TEXT}`;
  placeholder?: string;
};
export type ModuleUserOptionTextarea = ModuleUserOptionBase<string> & {
  type: `${ModuleUserOptionFieldType.TEXTAREA}`;
  placeholder?: string;
};
export type ModuleUserOptionNumber = ModuleUserOptionBase<number> & {
  type: `${ModuleUserOptionFieldType.NUMBER}`;
  placeholder?: string;
  min?: number;
  max?: number;
};

export type ModuleUserOptionStringList = ModuleUserOptionBase<string[]> & {
  type: `${ModuleUserOptionFieldType.STRINGLIST}`;
  text: string;
};

export type ModuleUserOptionNumberList = ModuleUserOptionBase<number[]> & {
  type: `${ModuleUserOptionFieldType.NUMBERLIST}`;
  text: string;
  min?: number;
  max?: number;
};

interface ObjectSchemaItemString {
  key: string;
  label: string;
  type: 'text';
}

interface ObjectSchemaItemNumber {
  key: string;
  label: string;
  type: 'number';
  min?: number;
  max?: number;
}

export type ObjectSchemaItem = ObjectSchemaItemString | ObjectSchemaItemNumber;
export type ObjectSchema = ObjectSchemaItem[];
export type ModuleUserOptionObjectList = ModuleUserOptionBase<object[]> & {
  type: `${ModuleUserOptionFieldType.OBJECTLIST}`;
  text: string;
  schema: ObjectSchema;
};

export type ModuleUserOption =
  | ModuleUserOptionDescription
  | ModuleUserOptionCheckbox
  | ModuleUserOptionRadioButton
  | ModuleUserOptionText
  | ModuleUserOptionTextarea
  | ModuleUserOptionNumber
  | ModuleUserOptionStringList
  | ModuleUserOptionNumberList
  | ModuleUserOptionObjectList;
export type ModuleUserOptions = (ModuleUserOption | undefined | false)[];

export interface IModuleOptions {
  name: string;
  category: string;
  description: string;
  displayText: string;
  experimental?: boolean;
  author?: string;
  source?: string;
  options?: ModuleUserOptions;
}
