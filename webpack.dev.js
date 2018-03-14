const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 9000,
        overlay: {
            warnings: false,
            errors: true
        },
        useLocalIp: false
    }
});