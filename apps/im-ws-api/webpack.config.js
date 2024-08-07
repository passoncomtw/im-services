const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/im-ws-api'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.js',
      tsConfig: './tsconfig.app.json',
      assets: [],
      optimization: false,
      outputHashing: 'none',
    }),
  ],
};
