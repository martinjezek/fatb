'use strict';

var gulp    = require('gulp'),
    jshint  = require('gulp-jshint');

gulp.task('default' , ['test']);
gulp.task('test'    , ['jshint']);

// JSHint /test/
// JavaScript Code Quality Tool - Helps to detect errors and potential problems in code.
//
gulp.task('jshint', function() {
    return gulp.src([
            '**/*.js',
            '!**/node_modules/**/*.js',
            '!**/bower_components/**/*.js'
        ])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});
