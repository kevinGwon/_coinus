const gutil = require('gulp-util'),
    config = require('./config'),
    fs = require('fs'),
    path = require('path');

module.exports = function() {
    let entry = {};

    entry[config.VENDOR_NAME] = config.VENDOR_LIB;

    function getEntries() {
        return fs.readdirSync(path.join('src', 'assets', config.ENTRY_PATH))
            .filter((file) => file.match(/.*\.js$/))
            .map((file) => {
                return {
                    name: file.substring(0, file.length - 3),
                    path: './' + path.join('assets', config.ENTRY_PATH, file)
                };
            }).reduce((memo, file) => {
                memo[file.name] = file.path;
                return memo;
            }, {});
    }

    entry = Object.assign(entry, getEntries());

    gutil.log(gutil.colors.blue('[webpack] entry'), gutil.colors.magenta(), '\n', entry);

    return entry;
};