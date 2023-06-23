import { resolveElement } from './resolve-element';

export function hideElement(element: string): void;
export function hideElement<TParent extends HTMLElement = HTMLElement>(element: TParent): void;

export function hideElement(element: string | HTMLElement): void {
  resolveElement(element).classList.add('hidden');
}
