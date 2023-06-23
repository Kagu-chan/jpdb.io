export function resolveElement<TResult extends HTMLElement = HTMLElement>(
  element: string | TResult,
): TResult {
  return typeof element === 'string' ? document.querySelector(element) : element;
}
