var gulp = require('gulp'),
  connect = require('gulp-connect'),
  jshint = require('gulp-jshint'),
  jasmine = require('gulp-jasmine'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  Server = require('karma').Server,
  htmlmin = require('gulp-htmlmin'),
  replace = require('gulp-replace'),
  fs = require('fs');

gulp.task('jshint', function() {
  return gulp.src('*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }));
});


gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: true
  });
});

gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('watch', function() {
  gulp.watch("*.js", ["jshint", "karma"]);
});

gulp.task('htmlmin', function() {
  return gulp.src('bmi-calculator.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('tmp'))
});

gulp.task('replace_html', ['htmlmin'], function(){
  return gulp.src(['tmp/bmi-calculator.html'])
    .pipe(replace(/'/g, "\\'"))
    .pipe(gulp.dest('tmp/'));
});

gulp.task('replace_js', ['htmlmin', 'replace_html'], function(){
  return gulp.src(['bmi-calculator.js'])
    .pipe(replace('templateUrl', 'template'))
    .pipe(replace('bmi-calculator.html', fs.readFileSync('tmp/bmi-calculator.html')))
    .pipe(gulp.dest('tmp/'));
});

gulp.task('compress', ['htmlmin', 'replace_html', 'replace_js'],  function() {
  return gulp.src('tmp/bmi-calculator.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['connect', 'watch']);
gulp.task('build', ['htmlmin', 'replace_html', 'replace_js', 'compress']);
