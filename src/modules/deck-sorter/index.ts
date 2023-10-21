/**
 * @TODO: Implement
 */
class DeckSorter {
  private DECK_SORTER: string = 'deck-sorter';
  private deckListDescription = `A value can either be a simple string or a regular expression.<br />
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
  private recognitionExplanation = `Sort by recognition, then by known words.<br />
Recognition is the value in parentheses (Words you have already seen, but do not "know" yet).<br />
<br />
If two decks have the same recognition value, it falls back to known words.<br />
This priority applies separately for Coverage and Vocab.`;
  private swapRecVocDescription = `Reverses the priority between known words and recognition.<br />
<br />
If two decks have the same percentage of known words, it will be sorted by recognition as a lower priority (instead of vice versa).`;
  private deprioritizeDescription = `Threshold where a deck gets deprioritized (when using default sort).<br />
<br />
Used to move decks with a certain coverage automatically down.<br />
Uses Coverage if available, otherwise Vocabulary.<br />
<br />
Respects the value of 'Reverse priority...' to choose breaking point.`;

  constructor() {
    // this.register();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: this.DECK_SORTER,
      category: 'Decks',
      displayText: 'Enable automatic deck sorting',
      description: 'Sort your decks on certain conditions locally',
      experimental: true,
      options: [
        {
          key: 'sort-by-cov',
          type: 'checkbox',
          default: true,
          text: 'Enable sorting by coverage',
          description:
            'Sorts decks by coverage. If a deck has no coverage, falls back to vocabulary.',
        },
        {
          key: 'sort-by-rec',
          type: 'checkbox',
          default: true,
          text: 'Sort decks by recognition',
          description: this.recognitionExplanation,
          hideOrDisable: 'disable',
          indent: true,
          children: [
            {
              key: 'swap-rec-voc',
              type: 'checkbox',
              default: true,
              text: 'Reverse priority between known and recognition',
              description: this.swapRecVocDescription,
            },
          ],
        },
        {
          key: 'deprioritize-at-enabled',
          type: 'checkbox',
          default: false,
          text: 'Deprioritize decks at a certain threshold',
          description: this.deprioritizeDescription,
          hideOrDisable: 'disable',
          indent: true,
          children: [
            {
              key: 'deprioritize-at',
              type: 'number',
              default: 90,
              min: 1,
              max: 100,
              placeholder: 'Deprioritize at',
            },
          ],
        },
        {
          key: 'top-decks',
          type: 'stringlist',
          default: ['/^Prio:/i', 'Mining', '/N5/i', '1K Top Anime Frequency List', 'Refold'],
          text: 'Decks to put at the top of the list',
          description: this.deckListDescription,
        },
        {
          key: 'bottom-decks',
          type: 'stringlist',
          default: [
            '/(?<defaut>\\d+K Top)/i',
            '/- N(?<desc>\\d)$/i',
            '/Club (?<default>\\d+):/i',
            '/Mining/i',
            'Graveyard',
          ],
          text: 'Decks to put at the end of the list',
          description: this.deckListDescription,
        },
      ],
    });
  }
}

new DeckSorter();
