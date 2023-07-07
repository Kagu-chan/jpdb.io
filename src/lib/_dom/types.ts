type DOMElementBaseOptions = {
  id?: string;
  class?: string[];
  attributes?: Record<string, string | boolean>;
  style?: Partial<CSSStyleDeclaration>;
  innerText?: string;
  innerHTML?: string;
  handler?: (ev?: MouseEvent) => void;
};

export type DOMElementOptions = DOMElementBaseOptions & {
  children?: DOMElementTagOptions[];
};

export type DOMElementTagOptions<
  K extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap,
> = DOMElementOptions & {
  tag: K;
};
