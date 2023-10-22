# JPDB Script Runner

An extension loader for [JPDB](https://jpdb.io) containing a selection of QoL changes.

# Installation

1. Install any user script manager of your choice, e.g. [Tampermonkey](https://www.tampermonkey.net/).
2. Download the latest version [here](https://github.com/Kagu-chan/jpdb.io/releases/latest/download/JPDB.io.user.js).
3. If your user script manager offers it, install or update, if not, add as a new script according to the extension.

If updates are available, they can be installed via your user script manager automatically or manually.

# Features

Most features can be enabled or disabled in the [settings](https://jpdb.io/settings).

EXPLAIN UNSUSPEND!

# Module Settings

At the end of the usual settings a new section `Module settings` will appear. All options here automatically save upon interaction, for text boxes you need to `click or tap outside` to update then.

## Decks

### Hide completed decks

Enable this option to hide decks which do not contain new cards.
This is evaluated against total amount, ignoring suspended cards (The `Vocabulary` bar is at 100% seen).

This is useful when you have lots of decks, as those are not clogging up the space if you're interested in the progress of those not yet finnished.

### Hide decks at Target coverage

Enable this option to hide decks which have reached the configured target coverage either globally or for this deck if overwritte (Patreon feature!).

This is useful when you have lots of decks, as those are not clogging up the space if you're interested in the progress of those not yet finnished.

### Hide non-new decks

Enable this to hide decks which do not contain new cards up until the first deck containing new cards.
This is evaluated taking suspended cards into account.

This is a technical limitation due to how JPDB exposes those information and is inaccurate if you have words to review.

- If you set your learning order to `All decks simultaneously, by frequency across our whole corpus`, all decks are monitored.
- If you set your learning order to `All decks simultaneously, by frequency across all of your decks`, this option becomes unavailable.

### Allow moving cards between decks

Enables you to **move** cards between decks.

You need to configure target decks, but can do some with as many decks as you like. To do this

- Open the `Target Decks` box
- Click `Add` to create a new empty element
- Enter the **Deck ID** in the first box, the desired **Label** into the second. The deck ID is the number in the URL if you have opened a deck.
- Click `Update` to save the list.

You can also

- Click `Reset` to discard all changes not yet saved per Update.
- Click `Restore defaults` to throw away all changes ever made.
- Click the `- (Minus)` button to remove an entry
- Use the arrow keys to reorder the entries.

## Learn Page

### Hide deck numbers

This simply hides the numbers on your decks.

### Hide decks

This hides the first four decks as well as the controls to create new decks from your learning page.
It also summarizes the link to your entire deck list and back to creating new decks in a button next to the review button.

### Hide special decks

This hides special decks from your learning page. This special decks are

- All vocabulary
- Blacklisted vocabulary
- Vocabulary I'll never forget

### Display deck statistics in one table

This converts the text containing the information about your progress into a new table.
It also coverts the table headers into direct links to direct links to the according filters.
Additionally it shows you your daily progress of learning new cards according to your JPDB settings.

_This also works on deck pages itself, but there the information about `new` and `due` cards is not available._

#### Force small (mobile) table

If your prefer a thinner table, enable this option. On mobile devices this option is not available and becomes the default.

#### Show combined totals

This calculates some additional stats, which are mainly useful if you have suspended cards from your collection.
**This stats are not accurate due to how JPDB exposes such information! They should still get a somewhat decent estimation**

The additional stats are as follows:

- Parantheses behind `Total`: Total of available cards taking suspended cards into account
- Progress: Cards you're currently learning or have failed recently, grouped by Vocabulary and Kanji.
- Upcoming: Cards which are either new or locked, grouped by Vocabulary and Kanji.
- Percentage in parantheses at the end: This is how many cards you know out of the total from the stats above, basically until you only have suspended cards left.

On mobile devices this table is formatted differently and those additional stats all end up in a third table section below the other stats.

## Navigation

### Custom Links

This option allows you to customize the links inside the header and footer navigation.

To configure your custom links, you need to

- Open the `Header navigation` or `Footer navigation` box
- Click `Add` to create a new empty element
- Enter the **LINK** in the first box, the desired **Label** into the second. If the link is recognized as external, it will open those in a new tab when clicked.
- Click `Update` to save the list.

You can also

- Click `Reset` to discard all changes not yet saved per Update.
- Click `Restore defaults` to throw away all changes ever made.
- Click the `- (Minus)` button to remove an entry
- Use the arrow keys to reorder the entries.

### Fix header navigation

This sets the header to a fixed position, thus being always visible.

### Fix footer navigation

This sets the footer to a fixed position, this being always visible. Also makes the footer collapse like the header on small devices.

### Add table of contents to settings

This adds a table of contents to the settings, allowing you to scroll directly to specific sections.
This table collapses on smaller space and hides in the top left or lower right corner depending on abvailable space.

## Reviews

### Automatically fail new cards

Use this option to remove the decision to make when seeing cards for the first time.
Only available if you have new cards directly revealed (`Automatically reveal new cards`).

This option is useful if you tend to fall for recency bias and rate cards as known when actually just remembering them from ten minutes earlier.
This also can help to combat the updated learning model (Patreon only) which tends to give really long reviews for cards never failed.

You can decide if you want to see this always or only on Vocabulary, Kanji or Name cards.

### Modify `I know this, will never forget`

Use this option to make it harder to never forget a new card.
Like automatically failing new cards, this option can help combat fast decisions on making cards never appear again.

You can decide if you want the button just to be hidden in the context menu (like the `Blacklist` option) or removed entirely.

### Remove some header labels from review, vocabulary and search results

Enable this option to remove some section headers on review, vocabulary or search results.
This helps free up some space on the screen and can be useful on smaller devices.

### Targeted Sentence Cards

Enable this option to remove the target word on reviews.
Leaving only the sentence with your target word left, turns vocab cards into so called `Targeted Sentence Cards` which helps to expose you to different contexts when reviewing.

### Hide sample sentence target word highlight

Enable this option to remove the word highlight in sample sentences.
This can help you practise recognizing the words inside a sentence without the eye directly jumping to it.

Together with `Targeted Sentence Cards` this effectively turns your vocabulary cards into pure `Sentence Cards`.

#### Tap to reveal

Reveals the target word on sentence click or tap.
This is useful if the sample sentence contains multiple currently learning words or complex grammar you're not familiar with.

## UI

### Add own CSS definitions

You can add your own CSS code to all of JPDB.

### Widen viewport

This option makes the main viewport of JPDB a bit wider.

### Enable scrolling controls on longer pages

This option adds a `To Top` and `To Buttom` link to some pages, for example [settings](https://jpdb.io/settings), [media search](https://jpdb.io/prebuilt_decks) and your [deck list](https://jpdb.io/deck-list) (can be configured to a given threshold) and some more.

You can configure the button order as well as the button position.

# Experimental Settings

Experimental settings are features which work in general, but still require a bit more testing.

_Currently there are **no** experimental features_

## License

[GPL](https://choosealicense.com/licenses/gpl-3.0/)
