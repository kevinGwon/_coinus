/*! webpack.config.js © iropke, 2017 */

const path = require('path'),
    webpack = require('webpack'),
    config = require('./task/config.js'),
    entries = (require('./task/webpack-entry.js'))();

require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
    stats: {
        colors: true,
        reasons: true
    },
    context: path.resolve(__dirname, config.SRC),
    entry: entries,
    output: {
        path: path.join(config.PUB, config.ASSETS, 'js'),
        publicPath: '/',
        filename: '[name].js'
    },

    resolve: {
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./node_modules/gsap/src/uncompressed/plugins'),
            path.resolve('./node_modules/scrollmagic/scrollmagic/uncompressed/plugins'),
            path.resolve(path.join(config.SRC, config.ASSETS, 'js'))
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            TweenMax: 'gsap'
        }),
    ],

    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/,
            loader: 'eslint-loader',
            exclude: /(node_modules|lib|safelog)/,
            options: {
                failOnWarning: false,
                failOnError: true
            }
        }, {
            test: /scrollmagic|masonry|fizzy-ui-utils|desandro-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
            use: 'imports-loader?define=>false&this=>window'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: [['es2015', { loose: true }]]
            }
        }]
    }
};