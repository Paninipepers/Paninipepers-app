const { defineConfig } = require('@vue/cli-service');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = defineConfig({
    configureWebpack: {
        plugins: [
            new InjectManifest({
                swSrc: './public/serviceworker.js'
            })
        ]
    }
});
