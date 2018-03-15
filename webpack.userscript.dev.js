const merge = require('webpack-merge');
const common = require('./webpack.dev.js');
const VersionFile = require('webpack-version-file');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = merge(common, {
    devServer: {},    
    plugins: [
        new VersionFile({
            output: "./dist/version.txt",
            package: "./package.json",
            template: "./resources/version-template.ejs",
            data: {
                environment: "-dev",
                buildNumber: "." + Date.now().toString(),
                updateUrl: "http://localhost:7070/greasemonkey/sztool-update.user.js",
            }
        }),
        new WebpackShellPlugin({
            onBuildEnd: [ 
                'if not exist .\\userscript md userscript',
                'type dist\\version.txt dist\\app.bundle.js > userscript\\sztool-update.user.js']
        }),
    ]
});