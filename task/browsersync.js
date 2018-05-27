'use strict';

const config = require('./config');

module.exports = (paths) => {
    let browserSync = require('browser-sync').create('bs_default');

    return {
        server: browserSync,
        task: () => {
            return (done) => {
                let port = config.BS_PORT + 2;

                browserSync.init({
                    port: port,
                    logPrefix: 'BS',
                    ghostMode: false,
                    server: {
                        baseDir: paths.PUB
                    },
                    startPath: '/',
                    ui: {
                        port: port + 1,
                        weinre: {
                            port: config.WEINRE_PORT
                        }
                    },
                    files: [
                        paths.PUB + '/**/*.js'
                    ]
                }, done);
            };
        }
    };
};