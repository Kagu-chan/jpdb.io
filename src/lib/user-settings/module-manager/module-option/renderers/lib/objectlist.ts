import { ObjectSchema } from '../../../module-options.type';

declare global {
  interface ObjectlistOptions {
    change: (value: object[]) => void;
    name: string;
    label: string;
    value: object[];
    schema: ObjectSchema;
    helpText?: string | HTMLElement;
  }
}

export const objectlist = (options: ObjectlistOptions): HTMLDivElement => {
  const input = document.jpdb.createElement('input', {
    attributes: {
      name: options.name,
      type: 'text',
      value: JSON.stringify(options.value),
      'data-key': options.name,
      disabled: true,
    },
  });

  input.onchange = (): void => options.change(JSON.parse(input.value) as object[]);

  return document.util.container([input]);
};
