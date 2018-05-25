/**
 * Clean
 * 배포, 개발 서버 디렉토리 비우기
 */

'use strict';

const clean = require('gulp-clean');

module.exports = (gulp, paths) => {
    return () => {
        return gulp.src(!gulp.isDist ? paths.PUB : paths.DIST, { read: false })
            .pipe(clean());
    };
};