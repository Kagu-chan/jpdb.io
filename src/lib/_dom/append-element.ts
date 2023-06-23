import { resolveElement } from './resolve-element';

export function appendElement<TChild extends HTMLElement = HTMLElement>(
  parent: string,
  element: TChild,
): TChild;
export function appendElement<
  TParent extends HTMLElement = HTMLElement,
  TChild extends HTMLElement = HTMLElement,
>(parent: TParent, element: TChild): TChild;

export function appendElement(parent: string | HTMLElement, child: HTMLElement): HTMLElement {
  resolveElement(parent).append(child);

  return child;
}
