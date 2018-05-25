/**
 * Webpack
 * javascript 파일을 Webpack으로 컴파일
 */

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
                            screw_ie8: false,   // screw_ie8 속성을 빼면 webpackJsonp 오류발생
                        },
                    })
                ]
            };
        }

        // import 참조 디렉토리 설정
        config.resolve.modules.pop();
        config.resolve.modules.push( path.resolve(path.join(paths.ASSETS, 'js')) );

        config.entry = getEntries(); // 엔트리 포인트 설정
        envConfig.output.path = path.resolve(envConfig.output.path); // 출력 경로 설정
        config.resolve.modules.push(path.resolve(path.join(paths.ASSETS, 'js'))); // 모듈 참조 경로 설정

        // 기존 설정과 병합
        config = merge(config, envConfig);

        // webpack 실행
        return webpack(config, function(err, stats) {
            if(err) throw new gutil.PluginError('webpack', err);

            gutil.log(gutil.colors.blue('[webpack]'), stats.toString({
                // output options
                stats: {
                    colors: true,
                    reasons: true
                },
            }));
        });
    };
};
