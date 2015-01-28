var gulp = require ('gulp'),
    notify = require('gulp-notify'),
    uglifyJS = require ('gulp-uglify'),
    livereload = require('gulp-livereload'),
    minifyHTML = require('gulp-minify-html'),
    del = require('del');

gulp.task ('default', function () {
  livereload.listen ();

  // ['./root/**/*.+(css|js|html)'].forEach (function (t) {
  ['./root/*.html', './root/css/**/*.css', './root/res/**/*.js', './root/js/**/*.js'].forEach (function (t) {
    gulp.watch (t).on ('change', function () {
      gulp.run ('reload');
    });
  });
});

gulp.task ('reload', function () {
  livereload.changed ();
  console.info ('\nReLoad Browser!\n');
});

gulp.task ('minify', function () {
  gulp.run ('js-uglify');
  gulp.run ('res-uglify');
});
gulp.task ('gh-pages', function () {
  del (['./root']);
});
gulp.task ('js-uglify', function () {
  gulp.src ('./root/js/*.js')
      .pipe (uglifyJS ())
      .pipe (gulp.dest ('./root/js/'));
});
gulp.task ('res-uglify', function () {
  gulp.src ('./root/res/**/*.js')
      .pipe (uglifyJS ())
      .pipe (gulp.dest ('./root/res/'));
});