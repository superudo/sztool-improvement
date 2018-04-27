const merge = require('webpack-merge');
const common = require('./webpack.prod.js');
const VersionFile = require('webpack-version-file');
const WebpackShellPlugin = require('webpack-shell-plugin');
const package = require("./package.json");

module.exports = merge(common, {
    plugins: [
        new VersionFile({
            output: "./dist/version.txt",
            package: "./package.json",
            template: "./resources/version-template.ejs",
            data: {
                environment: "",
                buildNumber : "",
                updateUrl: "https://openuserjs.org/meta/udo80/" + package.name + ".meta.js"
            }
          }),
          new WebpackShellPlugin({
            onBuildEnd: [ 
                'if not exist .\\userscript md userscript',
                'type dist\\version.txt dist\\app.bundle.js > userscript\\' + package.name + '.user.js']
        }),
    ]
});