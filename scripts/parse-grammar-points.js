const { readFileSync, writeFileSync } = require('fs');
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
const { exec } = require('child_process');

const input = './scripts/jp-grammar.html';
const xml = new XMLParser({
  ignoreAttributes: false,
  allowBooleanAttributes: true,
});
const doc = xml.parse(readFileSync(input));

const known = [];
const variants = {};
const originals = {};
const bSearch = {};

let c = 0;

doc.table = doc.table
  .filter((t) => {
    delete t.thead;
    delete t['@_id'];
    delete t['@_class'];
    const { tbody } = t;

    tbody.tr = tbody.tr.filter((tr) => {
      delete tr['@_class'];
      return Array.isArray(tr.td);
    });
    const firstIndex = tbody.tr[0].td[0]['#text'];

    if (known.includes(firstIndex)) return false;
    known.push(firstIndex);

    return true;
  })
  .map((t) => {
    t.tbody.tr.forEach(({ td }) => {
      const [id, romaji, kana, meaning, level] = td;
      const obj = {
        kana: kana.a['#text'].replace(/ + /g, '～').replace(/\n/g, ' '),
        link: kana.a['@_href'].split('/').reverse()[1],
        meaning: meaning['#text'].replace(/\n/g, ' '),
        level: level.a['#text'],
      };
      const items = obj.kana
        .split(/（|[\s\/]+|、/g)
        .map((k) => k.replace('）', ''))
        .filter((k) => k.length);

      const addTo = (target, key, includeM) => {
        const { kana } = obj;
        const v = includeM ? obj : kana;
        if (!target[key]) {
          target[key] = [v];
        } else {
          if (!includeM && target[key].includes(v)) return;
          target[key].push(v);
        }
      };

      if (obj.kana.endsWith('-adjectives')) return;

      items.forEach((item) => {
        addTo(variants, item, false);

        const newVariant = item.replace(/～/g, '.*').replace(/・・・/g, '.*');
        if (newVariant !== item) addTo(variants, newVariant);
      });
      addTo(originals, obj.kana, true);

      c++;
    });
    return t;
  });

function addBinaryItem(target, nextLevels, v) {
  const l = nextLevels.shift();

  if (!l || l === '.') {
    target[v] = [];
    variants[v]
      .map((k) => originals[k].map(({ kana }) => kana))
      .flat()
      .forEach((val) => {
        if (!target[v].includes(val)) target[v].push(val);
      });
    return;
  }
  if (!target[l]) {
    target[l] = {};
  }
  addBinaryItem(target[l], nextLevels, v);
}
Object.keys(variants).forEach((v) => {
  const [_0, _1, _2] = v.split('');
  addBinaryItem(bSearch, [_0, _1, _2], v);
});

const content = `/* eslint-disable max-len */
export const JP_GRAMMAR = ${JSON.stringify(
  {
    o: originals,
    v: variants,
    b: bSearch,
  },
  undefined,
  '\t',
)};
`;
writeFileSync('./src/modules/tag-grammar/jp-grammar.ts', content);

const child = exec(
  'npx prettier .\\src\\modules\\tag-grammar\\jp-grammar.ts --write --config ./.prettierrc',
);
child.stdout.pipe(process.stdout);
child.on('exit', function () {
  process.exit();
});
