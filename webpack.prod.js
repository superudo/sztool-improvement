const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const ClosureCompilerPlugin = require('webpack-closure-compiler');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'SIMPLE'
      },
      concurrency: 3
    }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});