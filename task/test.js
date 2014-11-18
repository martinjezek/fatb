'use strict';

module.exports = function(gulp, plugins) {

    // Test /task/
    // Run all available test tasks.
    // $ gulp test
    //
    gulp.task('test', function(done) {
        plugins.runSequence('jshint', done);
    });

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
        .pipe(plugins.jshint('./.jshintrc'))
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'));
    });

};
