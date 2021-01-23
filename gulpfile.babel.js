//https://github.com/Browsersync/recipes/tree/master/recipes/gulp.sass

import babel from 'gulp-babel';
import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import sass from 'gulp-sass'
import prefix from 'gulp-autoprefixer'
import inject from 'gulp-inject';
import imagemin from 'gulp-imagemin'



const server = browserSync.create();

const paths = {
    root: {
        src: 'src/',
        dest: './'
    },
    styles: {
        src: 'src/scss/**/*.scss',
        dest: './css/'
    },
    js: {
        src: 'src/js/**/*.js',
        dest: './js/'
    },
    images: {
        src: 'src/images/*',
        dest: './images/'
    },
    fonts: {
        src: 'src/fonts/**/*.{ttf,woff,eot,svg}',
        dest: './fonts/'
    },
};

// const clean = () => del([paths.root.dest]);

function scripts() {
    return gulp.src(paths.js.src, { sourcemaps: true })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('index.min.js'))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(server.reload({ stream: true }));
}

export function copyRootFiles() {
    return gulp.src(`${paths.root.src}/*.*`, { since: gulp.lastRun('copyRootFiles'), dot: true })
        .pipe(gulp.dest(paths.root.dest));
}

export function images() {
    return gulp.src(paths.images.src, { since: gulp.lastRun('images') })
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest))
}

export function fonts() {
    return gulp.src(paths.fonts.src, { since: gulp.lastRun('fonts') })
        .pipe(gulp.dest(paths.fonts.dest))
}

// Compile sass into CSS
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(server.reload({ stream: true }));
};

function html() {
    const sources = gulp.src([`${paths.js.dest}*.js`, `${paths.styles.dest}*.css`], { read: false });
    return gulp.src(`${paths.root.src}*.html`)
        .pipe(inject(sources, { ignorePath: 'dist' }))
        .pipe(gulp.dest(paths.root.dest))
        .pipe(server.reload({ stream: true }));
};

function serve(done) {
    server.init({
        server: {
            baseDir: './dist/'
        }
    });
    done();
}

function watch() {
    gulp.watch(paths.js.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.images.src, images);
    gulp.watch(`${paths.root.src}*.html`, html);
}

const build = gulp.series( scripts, styles, images, fonts, copyRootFiles, html, serve, watch);
export default build;