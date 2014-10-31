'use strict';

var gulp        = require('gulp'),
    jshint      = require('gulp-jshint'),
    bump        = require('gulp-bump'),
    argv        = require('yargs').argv,
    changelog   = require('conventional-changelog'),
    fs          = require('fs');

// Tasks /main/
// Gulp main tasks are developed to speed up your most used development processes.
//
gulp.task('default' , ['test']);
gulp.task('test'    , ['jshint']);
gulp.task('release' , ['test', 'bump', 'changelog']); // --version [major|minor|patch|prerelease]


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


// Bump /release/
// Semantic Versioning - Increment a version number according to given --version [major|minor|patch|prerelease] flag.
//
gulp.task('bump', function() {
    var available = ['major', 'minor', 'patch', 'prerelease'],
        version   =  'patch';
    if (argv.version && available.indexOf(argv.version) != -1) {
        version = argv.version;
    }
    return gulp.src([
            './package.json'
        ])
        .pipe(bump({ type: version }))
        .pipe(gulp.dest('./'));
});


// Changelog /release/
// The CHANGELOG.md file is a log of changes made to a project, such as bug fixes, new features, etc.
//
gulp.task('changelog', function(done) {
        var pkg  = require('./package.json');
        changelog({
            repository: pkg.repository,
            version: pkg.version
        }, function(err, log) {
            if (err) return done(err);
            fs.writeFile('./CHANGELOG.md', log, 'utf-8', function(err) {
                if (err) return done(err);
                done();
            });
        });
});
