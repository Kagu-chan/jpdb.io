const { mkdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const source = './scripts/banners/local.js';
const target = './dist/local.js';

mkdirSync('./dist');

const loadTarget = 'file://' + join(__dirname, '..', 'dist', 'bundle.js').replace(/\\/g, '/');
const content = readFileSync(source, 'utf-8').replace('@@file', loadTarget);

writeFileSync(target, content);

require('./runtime');
