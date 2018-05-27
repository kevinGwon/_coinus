'use strict';

const imagemin = require('gulp-imagemin');

module.exports = (gulp, paths) => {
    return () => {
        return gulp.src([
            paths.ASSETS_DIST + '/img/*',
            paths.ASSETS_DIST + '/img/**/*',
        ])
            .pipe(imagemin({
                verbose: true
            }))
            .pipe(gulp.dest(paths.ASSETS_DIST + '/img'));
    };
};