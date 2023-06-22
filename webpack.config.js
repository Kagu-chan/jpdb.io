const path = require('path');
const { readFileSync } = require('fs');
const { BannerPlugin, DefinePlugin } = require('webpack');
const { version, bugs, homepage } = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');

const bugUrl = bugs.url;
const gitUrl = homepage;

const isRelease = process.env.npm_lifecycle_event === 'build';
const target = isRelease ? 'release' : 'public';

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
  plugins: [
    new BannerPlugin({
      banner: () => readFileSync(`./userscripts/${target}.js`, 'utf-8'),
      raw: true,
    }),
    new DefinePlugin({
      'process.env.VERSION': JSON.stringify('v' + version),
      'process.env.NAME': JSON.stringify('JPDBScriptRunner'),
      'process.env.LINK': JSON.stringify(gitUrl),
      'process.env.BUGS': JSON.stringify(bugUrl),
    }),
    new CopyPlugin({
      patterns: [
        !isRelease && { from: './userscripts/local.js', to: './' },
        { from: 'LICENSE.md', to: './' },
      ].filter((v) => !!v),
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: isRelease ? 'JPDB.io.user.js' : 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    minimize: false,
    usedExports: true,
  },
};
