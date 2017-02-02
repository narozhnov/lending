'use strict';



/////////////////////////////////////////////////////////////////////////////
// GULP PLUGINS
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    ignore = require('gulp-ignore'),
    imageop = require('gulp-image-optimization'),
    rimraf = require('gulp-rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;



/////////////////////////////////////////////////////////////////////////////
// GULP PATHS
var path = {
    src: {
        html: 'src/*.html',
        img: 'src/assets/common/img/**/*.*',
        fonts: 'src/assets/common/fonts/**/*.*',
        css: 'src/assets/common/css/**/*.scss',
        js: 'src/assets/common/js/**/*.*',
        vendors_bower: 'src/assets/vendors/bower/**/*.*',
        vendors_manual: 'src/assets/vendors/manual/**/*.*'
    },
    build: {
        html: 'build/',
        img: 'build/assets/common/img/',
        fonts: 'build/assets/common/fonts/',
        css: 'build/assets/common/css',
        cssSource: 'build/assets/common/css/source',
        js: 'build/assets/common/js',
        vendors: 'build/assets/vendors'
    },
    watch: {
        html: 'src/*.html',
        img: 'src/assets/common/img/**/*.*',
        fonts: 'src/assets/common/fonts/**/*.*',
        css: 'src/assets/common/css/**/*.scss',
        js: 'src/assets/common/js/**/*.*',
        vendors: 'src/assets/vendors/**/*.*'
    },
    clean: ['build/*']
};



/////////////////////////////////////////////////////////////////////////////
// PRINT ERRORS
function printError(error) {
    console.log(error.toString());
    this.emit('end');
}



/////////////////////////////////////////////////////////////////////////////
// BROWSERSYNC SERVE
var config = {
    server: {
        baseDir: "./build"
    },
    files: ['./build/**/*'],
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "frontend",
    watchTask: true
};

gulp.task('serve', function () {
    setTimeout(function(){
        browserSync(config);
    }, 5000);
});



/////////////////////////////////////////////////////////////////////////////
// HTML BUILD
gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(ignore.exclude('_*.html'))
        .on('error', printError)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});



/////////////////////////////////////////////////////////////////////////////
// VENDORS BUILD
gulp.task('vendors:bower:build', function() {
    return gulp.src(path.src.vendors_bower)
        .pipe(gulp.dest(path.build.vendors))
});
gulp.task('vendors:manual:build', function() {
    return gulp.src(path.src.vendors_manual)
        .pipe(gulp.dest(path.build.vendors))
});



/////////////////////////////////////////////////////////////////////////////
// JAVASCRIPT BUILD
gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});



/////////////////////////////////////////////////////////////////////////////
// STYLES BUILD
gulp.task('css:build', function () {
    return gulp.src(path.src.css)
        .pipe(sass({outputStyle: 'expanded', indentWidth: 4}))
        .on('error', printError)
        .pipe(autoprefix({
            browsers: ['last 30 versions', '> 1%', 'ie 9'],
            cascade: true
        }))
        .pipe(ignore.exclude('mixins.css'))
        .pipe(gulp.dest(path.build.cssSource))
        .pipe(ignore.exclude('main.css'))
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}))
});



/////////////////////////////////////////////////////////////////////////////
// IMAGES BUILD
gulp.task('img:build', function (cb) {
    gulp.src(path.src.img)
        
        .on('error', printError)
        .pipe(gulp.dest(path.build.img))
        .on('end', cb)
});



/////////////////////////////////////////////////////////////////////////////
// FONTS BUILD
gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});



/////////////////////////////////////////////////////////////////////////////
// BUILD ALL
gulp.task('build', [
    'html:build',
    'fonts:build',
    'img:build',
    'css:build',
    'js:build',
    'vendors:bower:build',
    'vendors:manual:build'
]);


/////////////////////////////////////////////////////////////////////////////
// WATCH ALL
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.vendors], function(event, cb) {
        gulp.start('vendors:bower:build');
        gulp.start('vendors:manual:build');
    });
});



/////////////////////////////////////////////////////////////////////////////
// CLEAN PRODUCTION
gulp.task('clean', function () {
    return gulp.src(path.clean)
        .pipe(rimraf())
});



/////////////////////////////////////////////////////////////////////////////
// DEFAULT TASK
gulp.task('default', ['build', 'serve', 'watch']);

