type DOMElementBaseOptions = {
  id?: string;
  class?: string[];
  attributes?: Record<string, string | boolean>;
  style?: Partial<CSSStyleDeclaration>;
  innerText?: string;
  innerHTML?: string;
  handler?: (ev?: MouseEvent) => void;
  afterrender?: (element: HTMLElement) => void;
  afterchildrenrender?: (element: HTMLElement) => void;
  element?: HTMLElement;
};

export type DOMElementOptions = DOMElementBaseOptions & {
  children?: DOMElementTagOptions[];
};

export type DOMElementTagOptions<
  K extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap,
> = DOMElementOptions & {
  tag: K;
  afterrender?: (element: HTMLElementTagNameMap[K]) => void;
  afterchildrenrender?: (element: HTMLElementTagNameMap[K]) => void;
  element?: HTMLElementTagNameMap[K];
};
