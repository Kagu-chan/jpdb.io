import { ScrollControlOrder, ScrollControlPosition } from './types';

export const renderSettings = (
  order: ScrollControlOrder,
  position: ScrollControlPosition,
): void => {
  const l = document.jpdb.prependElement('#save-all-settings-box', {
    tag: 'span',
    class: ['settings-scroll-controls'],
  });
  const r = document.jpdb.appendElement('#save-all-settings-box', {
    tag: 'span',
    class: ['settings-scroll-controls'],
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const targets: [HTMLSpanElement, HTMLSpanElement] =
    position === ScrollControlPosition.B ? [l, r] : ScrollControlPosition.L ? [l, l] : [r, r];
};

export const unrenderSettings = (): void => {
  document.jpdb.withElements('.settings-scroll-controls', (e) => document.jpdb.destroyElement(e));
};
