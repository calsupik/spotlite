//Required Packages
const gulp = require('gulp')
const replace = require('gulp-replace')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')

gulp.task('backend', function() {
  return gulp.src("./web/src/**/*.js")
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest("./web/dist"))
})

//Global Files
var indexHTML = './www/index.html';
var indexJS = './web/public/js/index.js';

//Replace HTML with dev HTML
gulp.task('dev-html', function() {
  gulp.src(indexHTML)
    .pipe(replace('https://spot-lite.herokuapp.com/','../web/public/'))
    .pipe(replace('<script src="cordova.js"></script>', '<!--<script src="cordova.js"> </script>-->'))
    .pipe(gulp.dest('./www/'))
});

//Replace JS with dev JS
gulp.task('dev-js', function() {
  gulp.src(indexJS)
    .pipe(replace('document.addEventListener(\'deviceready\', app.onDeviceReady, false);', 'app.onDeviceReady();'))
    .pipe(gulp.dest('./web/public/js/'))
});

//Replace HTML with prod HTML
gulp.task('prod-html', function() {
  gulp.src(indexHTML)
    .pipe(replace('../web/public/','https://spot-lite.herokuapp.com/'))
    .pipe(replace('<!--<script src="cordova.js"> </script>-->', '<script src="cordova.js"></script>'))
    .pipe(gulp.dest('./www/'))
});

//Replace JS with prod JS
gulp.task('prod-js', function() {
  gulp.src(indexJS)
    .pipe(replace('app.onDeviceReady();', 'document.addEventListener(\'deviceready\', app.onDeviceReady, false);'))
    .pipe(gulp.dest('./web/public/js/'))
});

//Run dev tasks
gulp.task('prep-dev', [ 'backend', 'dev-html', 'dev-js' ])

//Run prod tasks
gulp.task('prep-prod', [ 'backend', 'prod-html', 'prod-js' ])
