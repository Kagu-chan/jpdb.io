const { version } = require('./package.json');
const replace = require('replace-in-file');

replace.sync({
  files: './userscripts/*',
  from: /\/\/ @version.*/,
  to: `// @version      ${version}`,
});
