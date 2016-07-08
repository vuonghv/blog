var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');

gulp.task('test', function() {
  gulp
    .src('./test/*.js')
    .pipe(mocha())
    .on('error', function(err) {
      this.emit('end');
    });
});

gulp.task('watch', function() {
  gulp.watch('**/*.js', ['test']);
});

gulp.task('runserver', function() {
  nodemon({
    script: 'index.js',
    ext: 'js json',
    ignore: ['var/', 'node_modules/']
  });
});
