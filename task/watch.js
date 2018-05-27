'use strict';

const config = require('./config'),
    gutil = require('gulp-util'),
    path = require('path');

module.exports = (gulp, paths) => {
    const gulpSync = require('gulp-sync')(gulp);

    return () => {
        gulp.watch([
            paths.SRC + '/*.hbs',
            paths.SRC + '/**/*.hbs',
            paths.SRC + '/partial/*.json',
            '!' + paths.ASSETS + '/**/*'
        ], function(event) {
            let relative = path.relative(paths.SRC, event.path),
                dir = path.dirname(relative).split(path.sep);

            if(dir.includes(config.PARTIAL)) {
                gulp.isCompileAll = true;
            }

            gulp.start('handlebars');
            gulp.isCompileAll = false;
        });

        gulp.watch([
            paths.PUB + '/*.html',
            paths.PUB + '/**/*.html'
        ], ['watchhtml']);

        gulp.watch([
            paths.ASSETS + '/js/*.js',
            paths.ASSETS + '/js/**/*.js',
        ], ['webpack']);

        gulp.watch([
            paths.ASSETS + '/scss/*.scss',
            paths.ASSETS + '/scss/**/*.scss',
        ], ['bless']);

        gulp.watch([
            paths.ASSETS + '/icon/*',
            paths.ASSETS + '/scss/modules/_icon.scss.tmpl'
        ], gulpSync.sync(['iconfont', 'scss']));

        gulp.watch([
            paths.ASSETS + '/image/**',
            paths.ASSETS + '/font/**',
            paths.ASSETS + '/video/**',
            paths.ASSETS + '/js/lib/**'
        ], ['assetsync']).on('error', () => {
            gutil.log('assetsync', gutil.colors.red('error'), 'rerun task for fallback...');
            gulp.start('assetsync');
        });
    };
};
