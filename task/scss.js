/**
 * SCSS
 * SCSS를 컴파일 하여 대상 디렉토리로 출력
 */

'use strict';

const sass = require('gulp-sass'),
    noop = require('gulp-noop'),
    wait = require('gulp-wait'),
    sourcemaps = require('gulp-sourcemaps'),
    moduleImporter = require('sass-module-importer');

module.exports = (gulp, paths) => {
    return () => {
        return gulp.src([
            paths.ASSETS + '/scss/*.scss',
            paths.ASSETS + '/scss/**/*.scss',
        ])
        .pipe(wait(100))
        .pipe(!gulp.isDist ? sourcemaps.init() : noop())
        .pipe(sass({importer: moduleImporter()}).on('error', sass.logError))
        .pipe(!gulp.isDist ? sourcemaps.write() : noop()) // 개발 모드일 때만 소스맵 출력
        .pipe(gulp.dest((!gulp.isDist ? paths.ASSETS_PUB : paths.ASSETS_DIST) + '/css'));
    };
};