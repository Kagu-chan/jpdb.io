const path = require('path');
const { readFileSync } = require('fs');
const { BannerPlugin, DefinePlugin } = require('webpack');
const { version } = require('./package.json');

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
