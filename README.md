# JPDB Script Runner

An extension loader for [JPDB](https://jpdb.io) containing a selection of QoL changes

# Installation

1. Install any user script manager of your choice, e.g. [Tampermonkey](https://www.tampermonkey.net/)
2. Download the latest version [here](https://github.com/Kagu-chan/jpdb.io/releases/latest/download/JPDB.io.user.js)
3. If your user script manager offers it, install or update, if not, add as a new script according to the extension

If updates are available, they can be installed via your user script manager automatically or manually

# Features

Most features can be enabled or disabled in the [settings](https://jpdb.io/settings)

## Custom CSS

You can add your own CSS code to all of JPDB.

## Custom links

You can add or remove own links in the header and footer navigation. Also you can remove existing links you don't need

- To hide existing links, simply check the according checkbox in the settings menu.
- To add new links, change the list in the settings:
  - Open the box with header or footer links
  - Click `Add` or press `Enter` on the last link
  - Enter an URL to navigate to
  - Enter a Text as label
  - Click `Update` once you modified the links to your likings
  - Save Extension settings
  - You can reorder, change or remove existing links. All chnages will be applied after clicking `Update`. Clicking `Reset` will discard all pending changes

## Hide deck numbers

You can hide the deck numbers in front of your deck list.

## Additional learning stats

Shows you a total sum of learning cards. If also can show you a hint when you reach a specified threshold of learning cards,  
preventing you from adding too much cards to your queue.

_This plugin will be extended with new, more useful features soon!_

## Move cards between decks

This allows you to move cards from one deck to another. This only works for your own decks, not for predefined decks, as they are readonly.

To add a new target deck, follow the instructions for custom links, but here you enter the target deck id (found in your navigation bar when you open a deck in the browser) and a label to show in the vocab dropdown.

If you have configured a target deck, a new option will appear if you open a word and open the vocab menu.

## Scroll on longer pages

Adds a `To top` and `To bottom` text on longer pages, namely [settings](https://jpdb.io/settings), [media search](https://jpdb.io/prebuilt_decks) and your [deck list](https://jpdb.io/deck-list) (can be configured to a given threshold).

It also allows you to center the footer navigation and display it at any given time except in settings or when doing reviews.

## Convert vocab cards to targeted sentence cards

This option removes the target word from your reviews, thus showing you the vocab only in context for you to translate. This type of card is called a targeted sentence card, as the target word is hightlighted in a sentence.

## Contributing

To add own features, fix my mistakes or simply play arround, you need `npm` installed on your computer.

- Check out the repository
- Install the dependecies with `npm i`
- Run `npm run watch` to start the file watcher
- Add a new user script either from `/dist/bundle.js` (needs an update after every change) or add the loader from `/dist/local.js`
  - The Loader script loads the `bundle.js` locally from your computer
  - For the Loader to work you need to enable local files in your user script manager!
- For a ready-to-use build, simply run `npm run build` and install the resulting file
- To check your code for code quality issues run `npm run lint`

## Creating Extensions

To add your own extensions, you can develop them under `/src/user-plugins` and enable them by exporting instances from `/src/user-plugins/index.ts`.

At a later point in time it is planned to allow scripts being added from other user script instances, thus not requirering you to rebuild everything for your own additions (and with that enabeling automatic updates for example)

## License

[GPL](https://choosealicense.com/licenses/gpl-3.0/)
