'use strict';

// npm
const fs = require('fs'),
    gutil = require('gulp-util');

// Gulp, task 생성기
let gulp = require('gulp');
const task = require('./task/task.js')(gulp),
    config = require('./task/config');

// 환경 변수
let argv = process.argv[process.argv.length - 1],   // 프로세스 실행 인자 (task 이름)
    currentTask = argv.split(':')[0];               // 현재 실행 중인 task 이름 (언어 접미사 제외)

// 프로젝트 루트 디렉토리 설정
gulp.__dirname = __dirname;

// 배포 모드 설정
gulp.isDist = (currentTask === 'dist' || currentTask === 'build');

// 단일 task를 배포용으로 동작시킬 때
if(currentTask.slice(-5) === '-dist') {
    gulp.isDist = true;
}

task();
