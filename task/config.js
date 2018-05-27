
'use strict';

module.exports = {
    SRC: 'src',                            
    PUB: 'public',                         
    DIST: 'dist',                          
    ASSETS: 'assets',                      
    PARTIAL: 'partial',                    

    VENDOR_NAME: 'vendor',
    VENDOR_LIB: [
        'jquery',
        'gsap'
    ],
    ENTRY_PATH: '/js/entry',

    BS_PORT: 3000,                          
    WEINRE_PORT: 8080,                      
    START_PATH: '/_guide/',                 

    PRESET: {
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

        dist: [
            'build',
            'distsync'
        ]
    }
};
