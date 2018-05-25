/**
 * 설정 파일
 */

'use strict';

module.exports = {
    // 프로젝트 설정

    // 경로
    SRC: 'src',                             // 소스 디렉토리
    PUB: 'public',                          // 개발 서버 root
    DIST: 'dist',                           // 배포 파일 디렉토리
    ASSETS: 'assets',                       // 정적 파일 디렉토리
    PARTIAL: 'partial',                     // handlebars partial 템플릿 디렉토리
    // DEST: '\\\\HOMEONE\\publishing\\cj-oshopping\\',        // 배포 목적지 경로

    // webpack entry
    VENDOR_NAME: 'vendor',
    VENDOR_LIB: [
        'jquery',
        'gsap'
    ],
    ENTRY_PATH: '/js/entry',

    // Browsersync
    BS_PORT: 3000,                          // 서버 기본 포트
    WEINRE_PORT: 8080,                      // Weinre 디버거 포트
    START_PATH: '/_guide/',                 // 브라우져 시작 경로

    // task 프리셋 정의
    PRESET: {
        // development
        default: [
            'clean',
            [
                'handlebars',
                'webpack',
                [
                    'iconfont',
                    'bless'
                ]
            ],
            'assetsync',
            'browsersync',
            'watch'
        ],

        // build
        build: [
            'clean',
            [
                'handlebars',
                'webpack',
                [
                    'iconfont',
                    'bless'
                ]
            ],
            'assetsync'
        ],

        // distribution
        dist: [
            'build',
            'distsync'
        ]
    }
};
