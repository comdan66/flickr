var gulp = require ('gulp'),
    livereload = require('gulp-livereload');

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
