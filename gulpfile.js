//https://github.com/Browsersync/recipes/tree/master/recipes/gulp.sass

var gulp = require('gulp')
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass')
var prefix = require('gulp-autoprefixer')
var reload = browserSync.reload;


var src = {
    scss: './scss/*.scss',
    css: './css/',
    html: './*.html'
};
// Static Server + watching scss/html files
gulp.task('serve', function () {

    browserSync.init({
        server: "."
    });

    gulp.watch(src.scss, gulp.series('sass'));
    gulp.watch(src.html).on('change', reload);
});

// Compile sass into CSS
gulp.task('sass', function () {
    return gulp.src(src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest(src.css))
        .pipe(reload({ stream: true }));
});

gulp.task('default', gulp.parallel('sass', 'serve'));