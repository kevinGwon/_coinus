/**
 * Watch
 * 변경되는 파일을 감시하고 대응하는 task 실행
 */

'use strict';

const config = require('./config'),
    gutil = require('gulp-util'),
    path = require('path');

module.exports = (gulp, paths) => {
    const gulpSync = require('gulp-sync')(gulp);

    return () => {
        // handlebars 템플릿 컴파일
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

        // js 컴파일 (webpack)
        gulp.watch([
            paths.ASSETS + '/js/*.js',
            paths.ASSETS + '/js/**/*.js',
        ], ['webpack']);

        // scss 컴파일
        gulp.watch([
            paths.ASSETS + '/scss/*.scss',
            paths.ASSETS + '/scss/**/*.scss',
        ], ['bless']);

        // 아이콘 폰트 생성
        gulp.watch([
            paths.ASSETS + '/icon/*',
            paths.ASSETS + '/scss/modules/_icon.scss.tmpl' // 아이콘 폰트 스타일 템플릿 변경
        ], gulpSync.sync(['iconfont', 'scss']));

        // 이미지 파일 개발 디렉토리로 동기화
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
