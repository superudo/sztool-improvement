const merge = require('webpack-merge');
const common = require('./webpack.dev.js');
const VersionFile = require('webpack-version-file');
const WebpackShellPlugin = require('webpack-shell-plugin');
const package = require("./package.json");

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
                updateUrl: "http://localhost:7070/greasemonkey/" + package.name + ".user.js",
            }
        }),
        new WebpackShellPlugin({
            onBuildEnd: [ 
                'if not exist .\\userscript md userscript',
                'type dist\\version.txt dist\\app.bundle.js > userscript\\' + package.name + '.user.js']
        }),
    ]
});