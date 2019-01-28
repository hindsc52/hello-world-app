/*
 * TO DO: load the webpack config in from `SPARTACUS_-render/webpack/*`
 */

/* eslint-disable global-require */
const nodeExternals = require('webpack-node-externals');

module.exports = ({ resolvePath, START_DEV_SERVER }) => {
  const serverConfig = {
    target: 'node', // compile for server environment
    entry: START_DEV_SERVER
      ? [
          // stop hoisting before polyfill runs https://github.com/babel/babel-preset-env/issues/112#issuecomment-292675082
          'babel-polyfill',
          'webpack/hot/poll?100',
          './src/index.js',
        ]
      : ['babel-polyfill', './src'],
    output: {
      path: resolvePath('build'),
      filename: 'server.js',
    },
    externals: [
      /**
       * Prevents `node_modules` from being bundled into the server.js
       * And therefore stops `node_modules` being watched for file changes
       */
      nodeExternals({
        whitelist: ['webpack/hot/poll?100'],
      }),
    ],
    watch: true,
  };

  if (START_DEV_SERVER) {
    const StartServerPlugin = require('start-server-webpack-plugin');
    const webpack = require('webpack');
    serverConfig.plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new StartServerPlugin('server.js'), // only start the server if we've run `npm run dev`
    ];
  }

  return serverConfig;
};
