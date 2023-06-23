import { resolveElement } from './resolve-element';

export function showElement(element: string): void;
export function showElement<TParent extends HTMLElement = HTMLElement>(element: TParent): void;

export function showElement(element: string | HTMLElement): void {
  resolveElement(element).classList.remove('hidden');
}
