import { PluginUserOptionRadioButton } from '../../../../lib/types';
import { Input } from './input.class';

export class RadioButtonInput extends Input<string, HTMLInputElement> {
  protected render(): HTMLInputElement {
    this.append('outer', this.container, 'div', {
      style: {
        marginLeft: '1rem',
      },
    });

    const options = this.options as PluginUserOptionRadioButton;
    let lastInput: HTMLInputElement;

    Object.values(options.options).forEach((value: string) => {
      this.append(`cb-${value}`, 'outer', 'div', { class: ['checkbox'] });

      lastInput = this.append(`ip-${value}`, `cb-${value}`, 'input', {
        id: `${this.name}-${value}`,
        attributes: {
          name: this.name,
          value,
          type: 'radio',
        },
      });

      this.append(`lb-${value}`, `cb-${value}`, 'label', {
        innerText: options.labels[value as keyof typeof options.labels],
        attributes: {
          for: `${this.name}-${value}`,
        },
      });

      console.log(this.value, value);
      if (this.value === value) {
        lastInput.checked = true;
      }
    });

    // debugger;
    return this.append('input', this.container, 'input');

    // <div class="checkbox"><input type="radio" id="learning-order-by-frequency-local" name="learning-order" value="by-frequency-local"><label for="learning-order-by-frequency-local">One deck at a time, by frequency within that deck</label></div><div class="checkbox"><input type="radio" id="learning-order-by-frequency-global" name="learning-order" value="by-frequency-global" checked=""><label for="learning-order-by-frequency-global">One deck at a time, by frequency across our whole corpus</label></div><div class="checkbox"><input type="radio" id="learning-order-by-frequency-global-all-decks" name="learning-order" value="by-frequency-global-all-decks"><label for="learning-order-by-frequency-global-all-decks">All decks simultaneously, by frequency across our whole corpus</label></div><div class="checkbox"><input type="radio" id="learning-order-by-frequency-local-all-decks" name="learning-order" value="by-frequency-local-all-decks"><label for="learning-order-by-frequency-local-all-decks">All decks simultaneously, by frequency across all of your decks</label></div><p class="explanation">This decides the default order in which new vocabulary will be taught to you. "Chronologically" will first teach you the words that were added to a given deck first or that appeared in the text first, depending on how the deck was constructed. "By frequency" will first teach you the vocabulary that is most frequently used, either locally within that deck, or globally across our whole corpus. <br><br> By default when picking a new card to show you we look through your decks in order, starting at the topmost deck on your list, and going through all of them top-to-bottom until we find the first deck which has something new. By selecting one of the last two options we'll always pick the most frequently used word from <i>all</i> of your decks, regardless of which exact deck it is.</p></div>
  }
}
