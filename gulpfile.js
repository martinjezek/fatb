'use strict';

var gulp        = require('gulp'),
    jshint      = require('gulp-jshint'),
    bump        = require('gulp-bump'),
    argv        = require('yargs').argv,
    changelog   = require('conventional-changelog'),
    fs          = require('fs'),
    runSequence = require('run-sequence'),
    exec        = require('child_process').exec;


// Defaut /task/
// Gulp default is set to run all test tasks.
// $ gulp
//
gulp.task('default', ['test']);


// Test /task/
// Run all available test tasks.
// $ gulp test
//
gulp.task('test', function(done) {
    runSequence('jshint', done);
});


// Release /task/
// Create a new version of the plugin.
// $ gulp release --version [major|minor|patch|prerelease]
//
gulp.task('release', function(done) {
   runSequence('test', 'bump', 'changelog', 'commit-release', done);
});


// JSHint /test/
// JavaScript Code Quality Tool - Helps to detect errors and potential problems in code.
// $ gulp jshint
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
// $ gulp bump --version [major|minor|patch|prerelease]
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
// $ gulp changelog
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

// Commit /release/
// Commit all changes and add a new Git tag
// $ gulp commit-release
//
gulp.task('commit-release', function(done) {
    var pkg  = require('./package.json');
    exec('git add -A', function(err) {
        if (err) return done(err);
        exec('git commit -m "chore: release v' + pkg.version + '"', function(err) {
            if (err) return done(err);
            exec('git tag "v' + pkg.version + '"', function(err) {
                if (err) return done(err);
                done();
            });
        });
    });
});
