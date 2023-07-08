const { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, statSync } = require('fs');
const { join } = require('path');

function requiresFromDir(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((v) => !['.', '..'].includes(v) && statSync(join(dir, v)).isDirectory())
    .map((d) => `import '.${dir}/${d}';`);
}

mkdirSync('runtime');

const entrypoint = `import '../src/${readFileSync('./src/entrypoint', 'utf-8').trim()}';`;
const sourcePlugins = requiresFromDir('./src/plugins');
const userPlugins = requiresFromDir('./plugins');

writeFileSync('./runtime/index.ts', [entrypoint, ...sourcePlugins, ...userPlugins].join('\n'));
