const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');


// Static server
gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: "build"
    }
  });
  gulp.watch('build/**/*').on('change', browserSync.reload);
});

// Gulp Pug

gulp.task('templates:compile', function buildHTML() {
  return gulp.src('source/template/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});

//Styles compile
gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(sass(/*{ outputStyle: 'compressed' }*/).on('error', sass.logError))
    .pipe(rename('main.css'))
    .pipe(gulp.dest('build/css'));
});

//spritesmitch

gulp.task('sprite', function (cb) {
  var spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '/images/sprite.png',
    cssName: 'sprite.scss'
  }));
  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));
  cb();
});

//Delete
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

//copy images
gulp.task('copy:images', function () {
  return gulp.src('source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

//copy fonts
gulp.task('copy:fonts', function () {
  return gulp.src('source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

//Copy
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

//Watchers
gulp.task('watch', function () {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});

//default
gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
  gulp.parallel('watch', 'server')
)
);

// concat 

gulp.task('scripts', function() {
  return gulp.src('./lib/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});

//compress

gulp.task('compress', function () {
  return pipeline(
        gulp.src('lib/*.js'),
        uglify(),
        gulp.dest('dist')
  );
});