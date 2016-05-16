'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');

const paths = ['server.js', 'gulpfile.js', 'lib/*.js', 'test/*.js', 'model/*.js', 'routes/*.js'];

gulp.task('lint', function(){
  gulp.src(paths)
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('mocha', function(){
  return gulp.src('test/*-test.js', {read: false})
  .pipe(mocha({reporter: 'nyan'}));

});

gulp.task('dev', function () {
  nodemon({
    script: 'server.js',
    tasks: ['lint'],
    ignore: [
      'node_modules/'
    ],
    ext: 'js'
  });
});

gulp.task('default', ['lint', 'mocha']);
