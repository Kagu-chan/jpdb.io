import { IModuleOptions } from '../../lib/user-settings/module-manager/module-options.type';
import {
  SCROLL_CONTROLS,
  ScrollControlOrderLabels,
  ScrollControlPositionLabels,
} from './constants';
import { ScrollControlOrder, ScrollControlPosition } from './types';

export const moduleOptions: IModuleOptions = {
  name: SCROLL_CONTROLS,
  category: 'UI',
  displayText: 'Enable scrolling controls on longer pages',
  description: 'Adds a Scroll to Top and Scroll to Bottom control on pages with more content',
  experimental: true,
  options: [
    {
      key: 'button-order',
      type: 'radio',
      options: ScrollControlOrder,
      labels: ScrollControlOrderLabels,
      default: ScrollControlOrder.BT,
      text: 'Scroll control order',
    },
    {
      key: 'button-position',
      type: 'radio',
      options: ScrollControlPosition,
      labels: ScrollControlPositionLabels,
      default: ScrollControlPosition.B,
      text: 'Scroll control position',
    },
    {
      key: 'in-settings',
      type: 'checkbox',
      text: 'Enable in settings',
    },
    {
      key: 'in-media-search',
      type: 'checkbox',
      text: 'Enable in media search',
      description: 'Enables scroll controls on deck search, e.g. `Built-in decks`',
    },
    {
      key: 'in-deck-list',
      type: 'checkbox',
      text: 'Enable in deck list',
      description: 'Enables scroll controls on your deck list',
      hideOrDisable: 'hide',
      indent: true,
      children: [
        {
          key: 'set-threshold',
          text: 'Only show after a certain deck threshold',
          type: 'checkbox',
          default: true,
          hideOrDisable: 'disable',
          indent: true,
          children: [
            {
              key: 'threshold',
              type: 'number',
              default: 50,
              placeholder: '',
              text:
                // eslint-disable-next-line max-len
                'If you have less decks (or equal), the scroll controls wont be shown in the deck list',
            },
          ],
        },
      ],
    },
  ],
};
