const { readFileSync, writeFileSync } = require('fs');

const source = './scripts/banners/release.js';
const target = './dist/JPDB.io.user.js';

const content = [readFileSync(source, 'utf-8'), readFileSync(target, 'utf-8')].join('\n\n');

writeFileSync(target, content);
