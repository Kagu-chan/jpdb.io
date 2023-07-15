import { JP_GRAMMAR } from './jp-grammar';

const TAG_GRAMMAR = 'tag-grammar';

jpdb.settings.registerConfigurable({
  name: TAG_GRAMMAR,
  category: 'Experimental',
  displayText: 'Highlight grammar in reviews',
});

jpdb.runAlwaysWhenActive('/review', TAG_GRAMMAR, () => {
  // eslint-disable-next-line no-console
  console.log('hello, im here to tag!');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const foo = JP_GRAMMAR;
});
