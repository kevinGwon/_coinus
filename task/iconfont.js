'use strict';

const path = require('path'),
    async = require('async'),
    iconfont = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),
    rename = require('gulp-rename'),

    FONT_NAME = 'icon',
    UNICODE_START = 0xEA01;

module.exports = (gulp, paths) => {
    return (done) => {
        function getChar() {
            let char = String.fromCharCode(UNICODE_START + unicodeOffset);

            unicodeOffset++;

            return char;
        }

        let unicodeOffset = 0,
            matchTable = (function() {
                let arr = {};

                for(let i=0; i<=9; i++) {
                    arr[i] = i + '';
                }

                arr['comma'] = ',';

                return arr;
            })();

        let iconStream = gulp.src([
            paths.ASSETS + '/icon/*.svg'
        ])
        .pipe(iconfont({
            fontName: FONT_NAME,
            formats: ['eot', 'woff', 'woff2'],
            normalize: true,
            fontHeight: 1000,
            metadataProvider: function(svgPath, meta) {
                let name = path.basename(svgPath, '.svg'),
                    char,
                    pattern = /count-([0-9]|comma)/,
                    match = pattern.exec(name);

                if(match) {
                    char = matchTable[match[1]];
                } else {
                    char = getChar();
                }

                meta(null, {
                    unicode: [char],
                    name: name
                });
            }
        }));

        async.parallel([
            function(cb) {
                iconStream.on('glyphs', function(glyphs) {
                    glyphs.map(function(item) {
                        item.unicode = item.unicode[0].charCodeAt().toString(16);

                        return item;
                    });

                    gulp.src(paths.ASSETS + '/scss/modules/_icon.scss.hbs')
                        .pipe(consolidate('handlebars', {
                            glyphs: glyphs,
                            fontName: FONT_NAME,
                            fontPath: '../font/',
                            cssClass: 'icon'
                        }))
                        .pipe(rename({
                            basename: '_icon',
                            extname: '.scss'
                        }))
                        .pipe(gulp.dest(paths.ASSETS + '/scss/modules'))
                        .on('finish', cb);
                });
            },
            function(cb) {
                iconStream
                    .pipe(gulp.dest(paths.ASSETS + '/font'))
                    .on('finish', cb);
            }
        ], done);
    };
};