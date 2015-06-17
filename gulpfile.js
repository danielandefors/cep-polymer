
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify'),
    vulcanize = require('gulp-vulcanize'),
    runSequence = require('run-sequence'),
    addsrc = require('gulp-add-src'),
    merge = require('merge-stream'),
    del = require('del');

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('default', ['clean'], function(cb) {
  return runSequence(
    ['scripts', 'styles', 'fonts', 'html', 'copy'],
    ['vulcanize'],
    cb
  );
});

gulp.task('scripts', function() {
  return gulp.src('src/scripts/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(addsrc('src/scripts/cep/*.js'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('styles', function() {
  return sass('src/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('vulcanize', function() {
  return gulp.src('dist/elements.html')
    .pipe(vulcanize({
      abspath: '',
      excludes: [],
      stripExcludes: false,
      inlineScripts: true,
      inlineCss: true,
      stripComments: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', function() {

  var manifest = gulp.src('manifest.xml')
    .pipe(gulp.dest('dist/CSXS'));

  var bower = gulp.src([
    'bower_components/**/*'
  ]).pipe(gulp.dest('dist/bower_components'));

  return merge(manifest, bower);

});

// Folder where the extension is deployed (in debug mode)
// The path is for Mac OS X only
var EXTENSION_NAME = 'CEPPolymer';
var DEPLOY_DIR = process.env.HOME
    + '/Library/Application Support/Adobe/CEP/extensions/'
    + EXTENSION_NAME;

// Deploy the extension to where we can debug it
gulp.task('deploy', ['undeploy', 'default'], function() {
  return gulp.src('dist/**/*')
    .pipe(addsrc('.debug'))
    .pipe(gulp.dest(DEPLOY_DIR))
    .pipe(notify( { message: 'Extension was deployed!', onLast: true }));
});

// Uninstall the extension
gulp.task('undeploy', function(cb) {
  del([DEPLOY_DIR], { force: true }, cb);
});

gulp.task('watch', ['deploy'], function() {
  gulp.watch('src/**/*', ['deploy']);
});

