const path = require('path');
const { DefinePlugin } = require('webpack');
const { version, bugs, homepage } = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');

const bugUrl = bugs.url;
const gitUrl = homepage;

const isRelease = process.env.npm_lifecycle_event === 'build';

const definePlugin = new DefinePlugin({
  'process.env.VERSION': JSON.stringify('v' + version),
  'process.env.NAME': JSON.stringify('JPDBScriptRunner'),
  'process.env.LINK': JSON.stringify(gitUrl),
  'process.env.BUGS': JSON.stringify(bugUrl),
});
const copyPlugin =
  isRelease &&
  new CopyPlugin({
    patterns: [{ from: 'LICENSE.md', to: './' }],
  });

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [definePlugin, copyPlugin].filter((v) => !!v),
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: isRelease ? 'JPDB.io.user.js' : 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: false,
  },
  optimization: {
    minimize: true,
    usedExports: true,
  },
};
