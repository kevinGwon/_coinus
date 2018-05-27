'use strict';

const _path = require('path'),
    config = require('./config'),
    syncy = require('syncy'),
    gutil = require('gulp-util');

module.exports = (gulp, paths) => {
    return (done) => {
        let dest = config.DEST;

        gutil.log('destination path: ', gutil.colors.cyan(dest));

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