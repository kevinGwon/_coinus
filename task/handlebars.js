'use strict';

const config = require('./config'),
    fs = require('fs'),
    path = require('path'),
    handlebars = require('gulp-compile-handlebars'),
    cache = require('gulp-cached'),
    trim = require('gulp-trim'),
    rename = require('gulp-rename'),
    htmlbeautify = require('gulp-html-beautify'),
    noop = require('gulp-noop'),
    glob = require('glob'),
    replace = require('gulp-replace'),
    wrap = require('gulp-wrap');

module.exports = (gulp, paths) => {
    return (done) => {

        return gulp.src([
            paths.SRC + '/*.hbs',
            paths.SRC + '/**/*.hbs',
            '!' + paths.SRC + '/' + config.PARTIAL + '/*.hbs',
            '!' + paths.SRC + '/' + config.PARTIAL + '/**/*.hbs',
            '!' + paths.SRC + '/**/' + config.PARTIAL + '/*.hbs',
            '!' + paths.SRC + '/**/' + config.PARTIAL + '/**/*.hbs',
            '!' + paths.ASSETS + '/**/*'
        ])
            .pipe(gulp.isCompileAll ? noop() : cache('handlebars'))
            .pipe(handlebars(null, {
                batch: glob.sync(paths.SRC + '/**/partial'),

                // 커스텀 helper 정의
                helpers: {
                    /**
                     * 변수 선언
                     *
                     * {{set '변수명' '값' }}
                     * 또는
                     * {{set
                     *     '변수명'
                     *     항목1 ='값1'
                     *     항목2 ='값2'
                     *     ...
                     * }}
                     */
                    set: function(name, val, opt) {
                        if(typeof opt === 'undefined') {
                            //noinspection JSUnusedAssignment
                            opt = val;
                            val = val.hash;
                        }

                        this[name] = val;
                    },

                    /**
                     * root 영역에 변수 선언
                     *
                     * {{setRoot '변수명' '값' }}
                     * 또는
                     * {{setRoot
                     *     '변수명'
                     *     항목1 ='값1'
                     *     항목2 ='값2'
                     *     ...
                     * }}
                     */
                    setRoot: function(name, val, opt) {
                        if(typeof opt === 'undefined') {
                            //noinspection JSUnusedAssignment
                            opt = val;
                            val = val.hash;
                        }

                        opt.data.root[name] = val;
                    },

                    /**
                     * JSON 파일 불러오기
                     *
                     * {{json '변수명' 'JSON 파일 경로' }}
                     * - 파일 경로는 사이트 root (src/[언어 디렉토리]) 기준
                     */
                    json: function(name, val) {
                        let file = fs.readFileSync(paths.SRC + '/' + val);
                        this[name] = JSON.parse(file);
                    },

                    /**
                     * JSON을 변수로 등록
                     */
                    jsonBlock: function(name, opt) {
                        this[name] = JSON.parse(opt.fn());
                    },

                    /**
                     * 문자열 합치기
                     * {{concat 값1 [값2] [값3] ... }}
                     */
                    concat : (...strings) => strings.filter(arg => typeof arg !== 'object').join(''),

                    /**
                     * 조건 처리
                     *
                     * {{cond (변수1) (연산자) (변수2)}}
                     *
                     * if 문에서 활용
                     * {{#if (cond (변수1) (연산자) (변수2)}}
                     *     ...
                     * {{else}}
                     *     ...
                     * {{/if}}
                     */
                    cond: function(a, operator, b) {
                        return eval(a + operator + b);
                    },

                    /**
                     * for문
                     *
                     * {{#for (시작) (종료) (증가값)}}
                     * {{#for 1 5 1}}{{this}}{{/for}}
                     * - partial/pagination.hbs 참조
                     */
                    for: function(from, to, inc, block) {
                        let accum = '';

                        from = parseInt(from);
                        to = parseInt(to);
                        inc = parseInt(inc);

                        for(let i = from; from <= to ? i <= to : i >= to; i += inc) {
                            accum += block.fn(i);
                        }

                        return accum;
                    },

                    /**
                     * 주어진 값을 1 증가시키기
                     */
                    inc: function(val) {
                        return parseInt(val) + 1;
                    },

                    /**
                     * 간단한 연산
                     *
                     * {{math @index "+" 1}}
                     */
                    math: function(val1, operator, val2) {
                        val1 = parseFloat(val1);
                        val2 = parseFloat(val2);
                            
                        return {
                            '+': val1 + val2,
                            '-': val1 - val2,
                            '*': val1 * val2,
                            '/': val1 / val2,
                            '%': val1 % val2
                        }[operator];
                    },

                    /**
                     * html 파일에 대응하는 handlebars 템플릿이 실제로 존재하는지 체크
                     * @param block
                     */
                    chkPath: function(block) {
                        let source = block.fn(),
                            pattern = /<a ([a-z\-]+="[^"]+" )?href="([^"]+)"( [a-z\-]+="[^"]+")?>([^<]+)<\/a>/gi;

                        source = source.replace(pattern, function(match, aheadProp, htmlPath, behindProp, innerText) {
                            htmlPath = path.parse(htmlPath);

                            if(!fs.existsSync(path.join(paths.SRC, htmlPath.dir, htmlPath.name + '.hbs'))) {
                                return innerText;
                            }

                            return match;
                        });

                        return source;
                    }
                }
            }))

            // 컴파일 에러 발생 시 핸들링
            .on('error', function(err) {
                console.log(err.toString());
                done();

                // browsersync client 스크립트 삽입을 위해 body 요소로 감싸기
                return this.pipe(wrap('<body><%= contents %></body>'));
            })

            // 상하 여백 제거 후 beautify 실행
            .pipe(trim())
            .pipe(htmlbeautify({
                indent_size: 4,
                end_with_newline: true,
                html: {
                    indent_inner_html: false,
                    indent_body_inner_html: false,
                    indent_head_inner_html: false,
                    extra_liners: []
                }
            }))

            // .pipe(replace('/assets', '/coinus/assets'))

            // html 파일로 확장자 변경
            .pipe(rename((path) => {
                path.extname = '.html';
            }))
            .pipe(gulp.dest(!gulp.isDist ? paths.PUB : paths.DIST));
    };
};