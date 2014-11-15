// Include gulp
var gulp = require('gulp'); 

// Include Plugins
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var prefix = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');

function swallowError (error) {

    //If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}

// Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        }
    });
});


// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});


// Lint Task
gulp.task('lint', function() {
    return gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Sass
gulp.task('sass', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .on('error', swallowError)
        .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(gulp.dest('./build/css'))
        .pipe(rename('style.css'))
        .pipe(minifyCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./build/css'))
        .pipe(reload({stream:true}));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('./src/js/*.js')
        // .on('error', swallowError)
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(rename('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./src/js/*', ['scripts']);
    gulp.watch('./src/sass/**/*', ['sass']);
    gulp.watch("./build/*.html", ['bs-reload']);
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'browser-sync', 'watch']);