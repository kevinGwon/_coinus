/**
 * assetsync
 * 소스 -> 개발 서버 디렉토리로 assets 파일 동기화
 */

'use strict';

const syncy = require('syncy'),
    gutil = require('gulp-util');

/**
 * 문자열을 정규식 패턴에 그대로 사용 가능하게 escape 처리
 * @param {string}str - escape 처리할 문자열
 * @returns {string}
 */
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

module.exports = (gulp, paths, bs) => {
    return (done) => {
        let fileList = [], // 변경 파일 목록
            re = new RegExp('^' + escapeRegExp(paths.ASSETS + '/'), 'g'); // 파일 경로 형식 일치를 위한 패턴

        // favicon 복사
        gulp.src(paths.SRC + '/favicon.ico')
            .pipe(gulp.dest(!gulp.isDist ? paths.PUB : paths.DIST));

        syncy([
            paths.ASSETS + '/font/**',
            paths.ASSETS + '/image/**',
            paths.ASSETS + '/video/**',
            paths.ASSETS + '/js/lib/**'
        ],  (!gulp.isDist ? paths.ASSETS_PUB : paths.ASSETS_DIST), {
            verbose: (stamp) => {
                // 변경된 파일 경로를 같은 형식으로 변경
                let file = stamp.action === 'copy' ? stamp.from.replace(re, '') : stamp.from;

                // 로그 출력
                gutil.log('assetsync', gutil.colors.cyan(stamp.action), stamp.from + ' -> ' + stamp.to);

                // 변경된 파일 목록에 추가
                fileList.push('/' + file);
            },
            base: paths.ASSETS,
            ignoreInDest: ['css/*.css', 'js/*.js']
        })
        .then(() => {
            // 개발 모드일 때 변경된 파일이 있을 경우 Browsersync 서버를 새로고침
            if(!gulp.isDist && typeof bs === 'object' && fileList.length) {
                bs.reload(fileList);
            }

            done();
        })
        .catch((err) => {
            done(err);
        });
    };
};
