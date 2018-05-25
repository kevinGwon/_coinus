/**
 * html 변경 시 bs에 반영
 */

'use strict';

const noop =  require('gulp-noop'),
    cache = require('gulp-cached');

module.exports = (gulp, paths, bs) => {
    return () => {
        return gulp.src([
            paths.PUB + '/*.html',
            paths.PUB + '/**/*.html',
        ])
            .pipe(cache('html'))
            .pipe(typeof bs === 'object' ? bs.stream({ once: true }) : noop());
    };
};