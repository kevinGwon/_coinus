'use strict';

const syncy = require('syncy'),
    gutil = require('gulp-util');

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

module.exports = (gulp, paths, bs) => {
    return (done) => {
        let fileList = [], 
            re = new RegExp('^' + escapeRegExp(paths.ASSETS + '/'), 'g');

        gulp.src(paths.SRC + '/favicon.ico')
            .pipe(gulp.dest(!gulp.isDist ? paths.PUB : paths.DIST));

        syncy([
            paths.ASSETS + '/font/**',
            paths.ASSETS + '/image/**',
            paths.ASSETS + '/video/**',
            paths.ASSETS + '/js/lib/**'
        ],  (!gulp.isDist ? paths.ASSETS_PUB : paths.ASSETS_DIST), {
            verbose: (stamp) => {
                let file = stamp.action === 'copy' ? stamp.from.replace(re, '') : stamp.from;

                gutil.log('assetsync', gutil.colors.cyan(stamp.action), stamp.from + ' -> ' + stamp.to);

                fileList.push('/' + file);
            },
            base: paths.ASSETS,
            ignoreInDest: ['css/*.css', 'js/*.js']
        })
        .then(() => {
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
