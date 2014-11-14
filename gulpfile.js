'use strict';

var gulp        = require('gulp'),
    jshint      = require('gulp-jshint'),
    bump        = require('gulp-bump'),
    argv        = require('yargs').argv,
    changelog   = require('conventional-changelog'),
    fs          = require('fs'),
    runSequence = require('run-sequence'),
    exec        = require('child_process').exec,
    jade        = require('gulp-jade'),
    sass        = require('gulp-sass'),
    del         = require('del'),
    connect     = require('gulp-connect'),
    concat      = require('gulp-concat'),
    minifyCSS   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify');


// Defaut /task/
// Gulp default is set to run a Gulp webserver with Gulp watches.
// $ gulp
//
gulp.task('default', ['connect', 'watch']);


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


// Demo /task/
// Compile a source demo data to a Demo build folder.
// $ gulp demo
//
gulp.task('demo', ['clean:demo', 'jade:demo', 'sass:demo', 'js:demo']);


// Distribution /task/
// Distribute a plugin source data to a Dist folder.
// $ gulp dist
//
gulp.task('dist', ['clean:dist', 'sass:dist', 'js:dist']);


// JSHint /test/
// JavaScript Code Quality Tool - Helps to detect errors and potential problems in code.
// $ gulp jshint
//
gulp.task('jshint', function() {
    return gulp.src([
        './**/*.js',
        '!./**/build/**/*.js',
        '!./**/dist/**/*.js',
        '!./**/node_modules/**/*.js',
        '!./**/bower_components/**/*.js'
    ])
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});


// Clean:dist /clean/
// Clean task remove all files and folders from the Dist build folder.
// $ gulp clean:dist
gulp.task('clean:dist', function (done) {
    del([
        './dist/*',
        '!./dist/.gitignore'
    ], { dot : true }, done);
});


// Clean:demo /clean/
// Clean task remove all files and folders from the Demo build folder.
// $ gulp clean:demo
gulp.task('clean:demo', function (done) {
    del([
        './demo/build/*',
        '!./demo/build/.gitignore',
        '!./demo/build/bower_components'
    ], { dot : true }, done);
});


// Clean:demo-html /clean/
// Clean task remove all HTML files from the Demo build folder.
// $ gulp clean:demo-html
gulp.task('clean:demo-html', function (done) {
    del([
        './demo/build/**/*.html'
    ], done);
});


// Clean:demo-css /clean/
// Clean task remove all CSS files from the Demo build folder.
// $ gulp clean:demo-css
gulp.task('clean:demo-css', function (done) {
    del([
        './demo/build/css/*'
    ], done);
});


// Clean:demo-js /clean/
// Clean task remove all JS files from the Demo build folder.
// $ gulp clean:demo-js
gulp.task('clean:demo-js', function (done) {
    del([
        './demo/js/*'
    ], done);
});


// Clean:dist-css /clean/
// Clean task remove all CSS files from the Dist folder.
// $ gulp clean:dist-css
gulp.task('clean:dist-css', function (done) {
    del([
        './dist/css/*'
    ], done);
});


// Clean:dist-js /clean/
// Clean task remove all JS files from the Dist folder.
// $ gulp clean:dist-js
gulp.task('clean:dist-js', function (done) {
    del([
        './dist/js/*'
    ], done);
});


// Jade /compiler/
// Compile all source Jade templates files as HTML files to the Demo build folder.
// $ gulp jade:demo
//
gulp.task('jade:demo', ['clean:demo-html'], function() {
    return gulp.src([
        './demo/src/jade/**/*.jade',
        '!./demo/src/jade/partials/*.jade'
    ])
    .pipe(jade())
    .pipe(gulp.dest('./demo/build/'))
    .pipe(connect.reload());
});


// JS /compiler/
// Beautify and Minify JS to the Demo folder.
// $ gulp js:demo
//
gulp.task('js:demo', ['clean:demo-js'], function() {
    return gulp.src([
        './demo/src/js/**/*.js'
    ])
    .pipe(uglify({
        mangle: false,
        output: {
            beautify: false,
            comments: false
        }
    }))
    .pipe(gulp.dest('./demo/build/js/'))
    .pipe(connect.reload());
});


// Sass /compiler/
// Compile and minify Sass styles to the Demo folder.
// $ gulp sass:demo
//
gulp.task('sass:demo', ['clean:demo-css'], function() {
    return gulp.src([
        './demo/src/sass/**/*.scss',
        './demo/src/sass/**/*.sass',
        '!./demo/src/saas/partials/*.*'
    ])
    .pipe(sass())
    .pipe(minifyCSS({ noAdvanced: true }))
    .pipe(gulp.dest('./demo/build/css/'))
    .pipe(connect.reload());
});


// Sass /compiler/
// Compile, concate and minify Sass styles to the Dist folder.
// $ gulp sass:dist
//
gulp.task('sass:dist', ['clean:dist-css'], function() {
    var pkg = require('./package.json');
    return gulp.src([
        './src/sass/**/*.scss',
        './src/sass/**/*.sass',
        '!./src/saas/partials/*.*'
    ])
    .pipe(sass())
    .pipe(concat(pkg.name + '.css'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(minifyCSS({ noAdvanced: true }))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(connect.reload());
});


// JS /compiler/
// Beautify and Minify JS to the Dist folder.
// $ gulp js:dist
//
gulp.task('js:dist', ['clean:dist-js'], function() {
    return gulp.src([
        './src/js/**/*.js'
    ])
    .pipe(uglify({
        mangle: false,
        output: {
            beautify: true,
            comments: /^!|@preserve|@license|@cc_on/i
        }
    }))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(uglify({
        mangle: false,
        output: {
            beautify: false,
            comments: false
        }
    }))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(connect.reload());
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
            './package.json',
            './bower.json'
        ])
        .pipe(bump({ type: version }))
        .pipe(gulp.dest('./'));
});


// Changelog /release/
// The CHANGELOG.md file is a log of changes made to a project, such as bug fixes, new features, etc.
// $ gulp changelog
//
gulp.task('changelog', function(done) {
        var pkg = require('./package.json');
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
    var pkg = require('./package.json');
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

// Connect /server/
// Plugin to run a webserver (with LiveReload).
// $ gulp connect
//
gulp.task('connect', function() {
    connect.server({
        root: ['./demo/build', './dist'],
        port: 9001,
        livereload: true
    });
});


// Watch /watch/
// Plugin creates watcher that will spy on files for changes and call certain tasks when it happens.
// $ gulp watch
//
gulp.task('watch', function () {
    // demo
    gulp.watch(['./demo/src/jade/**/*.jade'], ['jade:demo']);
    gulp.watch(['./demo/src/sass/**/*.scss', './demo/src/sass/**/*.sass'], ['sass:demo']);
    gulp.watch(['./demo/src/js/**/*.js'], ['js:demo']);
    // dist
    gulp.watch(['./src/sass/**/*.scss', './src/sass/**/*.sass'], ['sass:dist']);
    gulp.watch(['./src/js/**/*.js'], ['js:dist']);
});
