export function findOneElement(selector: string): HTMLElement;
export function findOneElement<K extends keyof HTMLElementTagNameMap>(
  selector: string,
  resultTag?: K,
): HTMLElementTagNameMap[K];
export function findOneElement(domElement: HTMLElement, selector: string): HTMLElement;
export function findOneElement<K extends keyof HTMLElementTagNameMap>(
  domElement: HTMLElement,
  selector: string,
  resultTag?: K,
): HTMLElementTagNameMap[K];

export function findOneElement(p0: string | HTMLElement, p1?: string, _?: string): HTMLElement {
  const root = typeof p0 === 'string' ? document : p0;
  const selector = typeof p0 === 'string' ? p0 : p1;

  return root.querySelector(selector);
}
