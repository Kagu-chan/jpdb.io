// import { Globals } from '../lib/globals';
import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import {
  PluginOptions,
  PluginUserOptionDependencyAction,
  PluginUserOptionFieldType,
  PluginUserOptions,
} from '../lib/types';
// import { CSSPlugin } from './css/css.plugin';

const deckListDescription = `A value can either be a simple string or a regular expression.<br />
<br />
For <a href="https://en.wikipedia.org/wiki/Regular_expression#Basic_concepts" target="_blank">regular expressions (pattern search)</a>, enclose the value with slahes (<code>/</code>).<br />
A regular expression may also end with a modifier (e.g. i for case insensitive).<br />
<br />
A pattern search can also contain capture groups (<code>/.*(?&lt;groupname&gt;match).*/i</code>) - those will be treated as pattern matches with specific behavior.<br />
Valid groups are as follows:<br />
<br />
<ul>
  <li><code>asc</code>     - sorts by number ASC</li>
  <li><code>desc</code>    - sorts by number DESC</li>
  <li><code>text</code>    - sorts alphabetically</li>
  <li><code>default</code> - sorts by Coverage (if not disabled), then by Vocabulary</li>
</ul>
`;
const recognitionExplanation = `Sort by recognition, then by known words.<br />
Recognition is the value in parentheses (Words you have already seen, but do not "know" yet).<br />
<br />
If two decks have the same recognition value, it falls back to known words.<br />
This priority applies separately for Coverage and Vocab.`;
const swapRecVocDescription = `Reverses the priority between known words and recognition.<br />
<br />
If two decks have the same percentage of known words, it will be sorted by recognition as a lower priority (instead of vice versa).`;
const deprioritizeDescription = `Threshold where a deck gets deprioritized (when using default sort).<br />
<br />
Used to move decks with a certain coverage automatically down.<br />
Uses Coverage if available, otherwise Vocabulary.<br />
<br />
Respects the value of 'Reverse priority...' to choose breaking point.`;

export class AutoSortDecksPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: ['/learn', '/deck-list'],
    canBeDisabled: true,
    name: 'Automatic deck sorting',
    description:
      'Sort your decks on certain conditions locally or remote (Currently without function!)',
    runAgain: true,
    beta: true,
    unfinnished: true,
  };

  protected _userSettings: PluginUserOptions = [
    {
      key: 'sort-by-cov',
      text: 'Enable sorting by coverage',
      description: 'Sorts decks by coverage. If a deck has no coverage, falls back to vocabulary.',
      type: PluginUserOptionFieldType.CHECKBOX,
      default: true,
    },
    {
      key: 'sort-by-rec',
      text: 'Sort decks by recognition',
      description: recognitionExplanation,
      type: PluginUserOptionFieldType.CHECKBOX,
      default: true,
    },
    {
      key: 'swap-rec-voc',
      text: 'Reverse priority between known and recognition',
      description: swapRecVocDescription,
      type: PluginUserOptionFieldType.CHECKBOX,
      default: true,
      dependsOn: 'sort-by-rec',
      hideOrDisable: PluginUserOptionDependencyAction.DISABLE,
      indent: true,
    },
    {
      key: 'deprioritize-at-enabled',
      text: 'Deprioritize decks at a certain threshold',
      description: deprioritizeDescription,
      type: PluginUserOptionFieldType.CHECKBOX,
      default: false,
    },
    {
      key: 'deprioritize-at',
      type: PluginUserOptionFieldType.NUMBER,
      default: 90,
      min: 1,
      max: 100,
      dependsOn: 'deprioritize-at-enabled',
      hideOrDisable: PluginUserOptionDependencyAction.DISABLE,
      indent: true,
      placeholder: 'Deprioritize at',
    },
    {
      key: 'top-decks',
      text: 'Decks to put at the top of the list',
      description: deckListDescription,
      type: PluginUserOptionFieldType.LIST,
      default: ['/^Prio:/i', 'Mining', '/N5/i', '1K Top Anime Frequency List', 'Refold'],
    },
    {
      key: 'bottom-decks',
      text: 'Decks to put at the end of the list',
      description: deckListDescription,
      type: PluginUserOptionFieldType.LIST,
      default: [
        '/(?<defaut>\\d+K Top)/i',
        '/- N(?<desc>\\d)$/i',
        '/Club (?<default>\\d+):/i',
        '/Mining/i',
        'Graveyard',
      ],
    },
  ];

  protected run(): void {
    this.addCSS();
  }

  private addCSS(): void {
    // Globals.pluginManager
    //   .get(CSSPlugin)
    //   .register(AutoSortDecksPlugin.name, '.deck-sidebar { display: none }');
  }
}
