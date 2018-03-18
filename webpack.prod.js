const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
/*    
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5_STRICT',
        compilation_level: 'SIMPLE'
      },
      concurrency: 3
    }),
*/    
    new UglifyPlugin({
      uglifyOptions: {
        ecma: 6,
        compress: true,
        extractComments: true,
      },
      test: /\.js($|\?)/i,
      sourceMap: false,

    }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});