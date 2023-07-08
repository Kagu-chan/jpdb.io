const { version } = require('../package.json');
const replace = require('replace-in-file');

replace.sync({
  files: './banners/*',
  from: /\/\/ @version.*/,
  to: `// @version      ${version}`,
});
