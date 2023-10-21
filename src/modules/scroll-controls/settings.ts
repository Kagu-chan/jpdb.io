import { SCROLL_CONTROLS } from './constants';
import { ScrollTarget, down, up } from './scroll';
import { ScrollControlOrder, ScrollControlPosition } from './types';

export const renderSettings = (
  order: ScrollControlOrder,
  position: ScrollControlPosition,
): void => {
  jpdb.css.add(SCROLL_CONTROLS, __load_css('./src/modules/scroll-controls/scroll-controls.css'));

  const l = document.jpdb.prependElement('#save-all-settings-box', {
    tag: 'span',
    class: ['settings-scroll-controls'],
  });
  const r = document.jpdb.appendElement('#save-all-settings-box', {
    tag: 'span',
    class: ['settings-scroll-controls'],
  });
  const orderEl = (
    {
      [ScrollControlOrder.BT]: [down, up],
      [ScrollControlOrder.TB]: [up, down],
    } as Record<ScrollControlOrder, [ScrollTarget, ScrollTarget]>
  )[order];
  const hasNavMenu = jpdb.settings.moduleManager.getActiveState('SettingsNav');

  const targets: [HTMLSpanElement, HTMLSpanElement] = (
    {
      [ScrollControlPosition.L]: [l, l],
      [ScrollControlPosition.R]: [r, r],
      [ScrollControlPosition.B]: [l, r],
    } as Record<ScrollControlPosition, [HTMLSpanElement, HTMLSpanElement]>
  )[position];

  targets.forEach((t: HTMLSpanElement, i: 0 | 1) => {
    document.jpdb.appendElement(t, {
      tag: 'input',
      class: [
        'outline',
        'v2',
        'scroll-control',
        position,
        `c-${i}`,
        hasNavMenu ? 'shift-left' : '',
      ],
      attributes: {
        type: 'button',
        value: orderEl[i].text,
      },
      handler: orderEl[i].fn,
    });
  });
};

export const unrenderSettings = (): void => {
  document.jpdb.withElements('.settings-scroll-controls', (e) => document.jpdb.destroyElement(e));

  jpdb.css.remove(SCROLL_CONTROLS);
};
