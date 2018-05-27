'use strict';

const fs = require('fs'),
    gutil = require('gulp-util');

let gulp = require('gulp');
const task = require('./task/task.js')(gulp),
    config = require('./task/config');

let argv = process.argv[process.argv.length - 1],   // 프로세스 실행 인자 (task 이름)
    currentTask = argv.split(':')[0];               // 현재 실행 중인 task 이름 (언어 접미사 제외)

gulp.__dirname = __dirname;

gulp.isDist = (currentTask === 'dist' || currentTask === 'build');

if(currentTask.slice(-5) === '-dist') {
    gulp.isDist = true;
}

task();
