// .eslintrc.js
module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'node': true,
        'amd': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        '$': false,
        'TweenMax': false,
        'TimelineMax': false,
        'Power0': false,
        'Power1': false,
        'Power2': false,
        'Power3': false,
        'Power4': false,
        'Circle': false,
        'Elastic': false,
        'Sine': false,
        'CustomEase': false,
        'google': false,
        'Modernizr': false
    },
    'rules': {
        'indent': ['warn', 4, {'SwitchCase': 1}],
        // 'linebreak-style': [
        //     'warn',
        //     'unix'
        // ],
        'no-console': 0,
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-unused-vars': [
            'warn'
        ]
    },
    'parserOptions': {
        'sourceType': 'module'
    }
};
