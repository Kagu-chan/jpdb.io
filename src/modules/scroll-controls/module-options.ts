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
      default: false,
    },
    {
      key: 'in-media-search',
      type: 'checkbox',
      text: 'Enable in media search',
      default: false,
      description: `
<div>Enables scroll controls on deck searches, namely the following:</div>
<ul>
<li><a href="/prebuilt_decks">Build-in decks</a></li>
<li><a href="/anime-difficulty-list">Anime difficulty list</a></li>
<li><a href="/novel-difficulty-list">Novel difficulty list</a></li>
<li><a href="/visual-novel-difficulty-list">Visual novel difficulty list</a></li>
<li><a href="/web-novel-difficulty-list">Web novel diffuculty list</a></li>
<li><a href="/live-action-difficulty-list">Live action difficulty list</a></li>
</ul>
<div>They are all the same, but with different filter presets.</div>`,
    },
    {
      key: 'in-deck-list',
      type: 'checkbox',
      text: 'Enable in deck list',
      default: false,
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
    jpdb.settings.hasPatreonPerks() && {
      key: 'in-kanji-wall',
      type: 'checkbox',
      text: 'Enable on the wall of kanj',
      default: false,
      description: 'Enables scroll controls on the <a href="/labs/wall-of-kanji">wall of kanji</a>',
    },
    {
      key: 'in-kanken-kanji',
      type: 'checkbox',
      text: 'Enable on Kanken kanji list',
      default: false,
      description: 'Enables scroll controls on the <a href="/kanken-kanji">Kanken kanji list</a>',
    },
    {
      key: 'in-kanji-freq',
      type: 'checkbox',
      text: 'Enable on kanji frequency list',
      default: false,
      description:
        'Enables scroll controls on the <a href="/kanji-by-frequency">kanji frequency list</a>',
    },
  ],
};
