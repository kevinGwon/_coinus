'use strict';

const gutil = require('gulp-util'),
    path = require('path'),
    webpack = require('webpack'),
    merge = require('webpack-merge'),
    getEntries = require('../task/webpack-entry.js');

module.exports = (gulp, paths) => {
    return () => {
        let config = require('../webpack.config'),
            envConfig;

        if (!gulp.isDist) {
            envConfig = {
                entry: {
                    vendor: ['../task/debug']
                },
                output: {
                    path: paths.ASSETS_PUB + '/js'
                }
            };
        } else {
            envConfig = {
                output: {
                    path: paths.ASSETS_DIST + '/js'
                },
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        mangle: false,
                        sourceMap: false,
                        compress: {
                            drop_console: true,
                            warnings: false,
                            screw_ie8: false,
                        },
                        output: {
                            screw_ie8: false,
                        },
                    })
                ]
            };
        }

        config.resolve.modules.pop();
        config.resolve.modules.push( path.resolve(path.join(paths.ASSETS, 'js')) );

        config.entry = getEntries();
        envConfig.output.path = path.resolve(envConfig.output.path);
        config.resolve.modules.push(path.resolve(path.join(paths.ASSETS, 'js')));

        config = merge(config, envConfig);

        return webpack(config, function(err, stats) {
            if(err) throw new gutil.PluginError('webpack', err);

            gutil.log(gutil.colors.blue('[webpack]'), stats.toString({
                stats: {
                    colors: true,
                    reasons: true
                },
            }));
        });
    };
};
