import { appendElement } from './append-element';
import { DOMElementOptions, DOMElementTagOptions } from './types';

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: DOMElementOptions,
): HTMLElementTagNameMap[K];
export function createElement<K extends keyof HTMLElementTagNameMap>(
  options: DOMElementTagOptions<K>,
): HTMLElementTagNameMap[K];

export function createElement(
  p0: string | DOMElementTagOptions,
  p1?: DOMElementOptions,
): HTMLElement {
  const tag = typeof p0 === 'string' ? p0 : p0.tag;
  const options = (p1 ?? p0 ?? {}) as DOMElementOptions;

  const e = document.createElement(tag);

  if (options.id) e.setAttribute('id', options.id);
  if (options.innerText) e.innerText = options.innerText;
  if (options.innerHTML) e.innerHTML = options.innerHTML;
  if (options.handler) e.onclick = options.handler;

  Object.keys(options.attributes ?? {}).forEach((key: string) => {
    const value = options.attributes[key];

    if (value === false) return;
    e.setAttribute(key, value as string);
  });
  Object.keys(options.style ?? {}).forEach((key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (e.style as any)[key] = options.style[key as keyof CSSStyleDeclaration];
  });

  e.classList.add(...(options.class ?? []));

  options.afterrender?.(e);
  (options.children ?? []).forEach((ch) => appendElement(e, createElement(ch)));
  options.afterchildrenrender?.(e);

  options.element = e;

  return e;
}
