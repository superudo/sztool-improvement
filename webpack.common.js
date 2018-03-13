const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VersionFile = require('webpack-version-file');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
  entry: {
    app: './src/main.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Production',
      template: './src/index.html'
    }),
    new VersionFile({
      output: "./dist/version.txt",
      package: "./package.json",
      template: "./resources/version-template.ejs"
    }),
    new WebpackShellPlugin({
      onBuildEnd: [ 'type dist\\version.txt dist\\app.bundle.js > dist\\sztool-update.user.js']
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node-modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  }
};
