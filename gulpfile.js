const gulp = require('gulp')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')

gulp.task('src', function() {
  return gulp.src("./web/src/**/*.js")
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest("./web/dist"))
})

gulp.task('build', [ 'src' ], function() {})
