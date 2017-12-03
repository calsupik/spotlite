//Required Packages
var gulp = require('gulp');
var replace = require('gulp-replace');
 
//Global Files
var indexHTML = './www/index.html';
var indexJS = './web/js/index.js';

//Replace HTML with dev HTML
gulp.task('dev-html', function() {
  gulp.src(indexHTML)
    .pipe(replace('<script src="https://spot-lite.herokuapp.com/js/index.js"></script>', '<script src="../web/js/index.js"></script>'))
    .pipe(replace('<script src="cordova.js"></script>', '<!--<script src="cordova.js"> </script>-->'))
    .pipe(gulp.dest('./www/'))
});

//Replace JS with dev JS
gulp.task('dev-js', function() {
  gulp.src(indexJS)
    .pipe(replace('document.addEventListener(\'deviceready\', app.onDeviceReady, false);', 'app.onDeviceReady();'))
    .pipe(gulp.dest('./web/js/'))
});

//Replace HTML with prod HTML
gulp.task('prod-html', function() {
  gulp.src(indexHTML)
    .pipe(replace('<script src="../web/js/index.js"></script>', '<script src="https://spot-lite.herokuapp.com/js/index.js"></script>'))
    .pipe(replace('<!--<script src="cordova.js"> </script>-->', '<script src="cordova.js"></script>'))
    .pipe(gulp.dest('./www/'))
});

//Replace JS with prod JS
gulp.task('prod-js', function() {
  gulp.src(indexJS)
    .pipe(replace('app.onDeviceReady();', 'document.addEventListener(\'deviceready\', app.onDeviceReady, false);'))
    .pipe(gulp.dest('./web/js/'))
});

//Run dev tasks
gulp.task('prep-dev', [ 'dev-html', 'dev-js' ]);

//Run prod tasks
gulp.task('prep-prod', [ 'prod-html', 'prod-js' ]);