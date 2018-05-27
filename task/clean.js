'use strict';

const clean = require('gulp-clean');

module.exports = (gulp, paths) => {
    return () => {
        return gulp.src(!gulp.isDist ? paths.PUB : paths.DIST, { read: false })
            .pipe(clean());
    };
};