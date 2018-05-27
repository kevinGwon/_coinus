'use strict';

const config = require('./config');

module.exports = (gulp) => {

    return () => {
        const gulpSync = require('gulp-sync')(gulp);

        // 경로 정의
        const paths = {
            SRC: config.SRC,
            PUB: config.PUB,
            DIST: config.DIST,
            ASSETS: config.SRC + '/' + config.ASSETS,
            ASSETS_PUB: config.PUB + '/' + config.ASSETS,
            ASSETS_DIST: config.DIST + '/' + config.ASSETS,
        };

        let browserSync = require('./browsersync')(paths);

        function task() {
            let callbackIdx = 1,
                addDistTask = arguments[2],
                args = Array.prototype.slice.call(arguments, 0, arguments.length >= 3 ? -1 : arguments.length),
                name = args[0];

            if(Array.isArray(args[1])) {
                callbackIdx = 2;
                addDistTask = arguments[3];
            }

            if(typeof args[callbackIdx] === 'string') {
                args[callbackIdx] = require('./' + args[callbackIdx])(gulp, paths, browserSync.server);
            }

            gulp.task.apply(gulp, args);

            if(addDistTask) {
                args[0] = name + '-dist';
                gulp.task.apply(gulp, args);
            }
        }

        // task preset 만들기
        Object.keys(config.PRESET).forEach((task) => {
            let tasks = config.PRESET[task];
            gulp.task(task, gulpSync.sync(tasks));
        });

        // task 정의
        task('clean', 'clean', true);
        task('browsersync', browserSync.task());
        task('handlebars', 'handlebars', true);
        task('watchhtml', 'watchhtml');
        task('scss', 'scss', true);
        task('bless', ['scss'], 'bless', true);
        task('webpack', 'webpack', true);
        task('imagemin', 'imagemin');
        task('assetsync', 'assetsync', true);
        task('iconfont', 'iconfont', true);
        task('watch', 'watch');
        task('distsync', 'distsync');
    };
};