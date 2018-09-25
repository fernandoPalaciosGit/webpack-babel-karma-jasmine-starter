const path = require('path');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const parts = require('./webpack.parts');

const paths = {
  lib: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'lib')
};

const lintJSOptions = {
  emitWarning: true,

  // Fail only on errors
  failOnWarning: false,
  failOnError: true,

  // Toggle autofix
  fix: true,

  formatter: require('eslint-friendly-formatter')
};

const commonConfig = merge([
  {
    devtool: 'source-map',
    entry: {
      lib: paths.lib
    },
    output: {
      path: paths.build,
      library: 'Demo',
      libraryTarget: 'umd'
    },
    plugins: [
      new FriendlyErrorsPlugin()
    ]
  },
  parts.lintJS({ include: paths.lib, options: lintJSOptions }),
  parts.loadJS({ include: paths.lib })
]);

const libraryConfig = merge([
  commonConfig,
  {
    output: {
      filename: '[name].js'
    }
  }
]);

const libraryMinConfig = merge([
  commonConfig,
  {
    output: {
      filename: '[name].min.js'
    }
  },
  parts.minifyJS()
]);

module.exports = env => {
  if (env === 'production') {
    return [
      libraryMinConfig,
      libraryConfig
    ];
  }

  return libraryConfig;
};
