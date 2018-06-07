'use strict';

const fs = require('fs'),
    gutil = require('gulp-util');

let gulp = require('gulp');
const task = require('./task/task.js')(gulp),
    config = require('./task/config');

let argv = process.argv[process.argv.length - 1],
    currentTask = argv.split(':')[0];

gulp.__dirname = __dirname;

gulp.isDist = (currentTask === 'dist' || currentTask === 'build');

if(currentTask.slice(-5) === '-dist') {
    gulp.isDist = true;
}

task();
