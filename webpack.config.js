const path = require('path');
const { readFileSync } = require('fs');
const { BannerPlugin, DefinePlugin } = require('webpack');
const { version, bugs, homepage } = require('./package.json');

const bugUrl = bugs.url;
const gitUrl = homepage;

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
    new BannerPlugin({ banner: () => readFileSync('./userscript.js', 'utf-8'), raw: true }),
    new DefinePlugin({
      'process.env.VERSION': JSON.stringify('v' + version),
      'process.env.NAME': JSON.stringify('JPDBScriptRunner'),
      'process.env.LINK': JSON.stringify(gitUrl),
      'process.env.BUGS': JSON.stringify(bugUrl),
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    minimize: false,
    usedExports: true,
  },
};
