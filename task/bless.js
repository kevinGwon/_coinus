/**
 * Bless
 * IE 9 이하의 브라우저의 CSS 크기 제한으로 인해 CSS 파일 분리
 */

'use strict';

const bless = require('gulp-bless'),
    cleanCSS = require('gulp-clean-css'),
    noop = require('gulp-noop');

module.exports = (gulp, paths, bs) => {
    return () => {
        let dir = !gulp.isDist ? paths.ASSETS_PUB : paths.ASSETS_DIST;

        return gulp.src([
            dir + '/css/style.css',
            dir + '/css/legacy-ie.css',
        ])
            .pipe(bless({
                suffix: function(i) {
                    return '' + (i + 1);
                }
            }))
            .pipe(!gulp.isDist ? noop() : cleanCSS({ inline: false })) // 배포 중일 때 CSS 압축
            .pipe(gulp.dest(dir + '/css'))
            .pipe(!gulp.isDist && typeof bs === 'object' ? bs.stream() : noop());
    };
};