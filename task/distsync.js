/**
 * DistSync
 * 배포 빌드된 파일을 배포 디렉토리로 복사
 */

'use strict';

const _path = require('path'),
    config = require('./config'),
    syncy = require('syncy'),
    gutil = require('gulp-util');

module.exports = (gulp, paths) => {
    return (done) => {
        // 배포 경로 지정
        let dest = config.DEST;
        // let dest =  _path.join(config.DEST);

        gutil.log('destination path: ', gutil.colors.cyan(dest));

        //
        // if(dest === config.DEST) {
        //     done(new Error(gutil.colors.red('최종 배포 경로가 배포 기본 경로와 같습니다.')));
        //     return;
        // }

        syncy([
            paths.DIST + '/**'
        ], dest, {
            base: paths.DIST,
            verbose: (stamp) => {
                gutil.log('dist', gutil.colors.cyan(stamp.action), stamp.from + ' -> ' + stamp.to);
            }
        })
            .then(() => {
                done();
            })
            .catch((err) => {
                done(err);
            });
    };
};