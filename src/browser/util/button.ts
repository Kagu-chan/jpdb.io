declare global {
  interface ButtonOptions {
    type?: 'default' | 'error' | 'gray' | 'warning' | 'success';
    handler?: () => void;
  }
}

const typeMap: Record<ButtonOptions['type'], string> = {
  default: 'v0',
  error: 'v1',
  gray: 'v2',
  warning: 'v3',
  success: 'v4',
};

export const button = (text: string, options?: ButtonOptions): HTMLInputElement => {
  const v = typeMap[options?.type ?? 'default'];

  return document.jpdb.createElement('input', {
    class: ['outline', v],
    attributes: {
      type: 'submit',
      value: text,
    },
    handler: (e): void => {
      e.preventDefault();

      options?.handler?.();
    },
  });
};
