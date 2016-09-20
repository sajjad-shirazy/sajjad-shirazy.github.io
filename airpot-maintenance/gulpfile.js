'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var twig = require('gulp-twig');
var htmlmin = require('gulp-htmlmin');

var sass_files_dir = '';

var paths = {
  sass:'./sass/**/**/*.scss',
  js:'./js/**/*.js'
};

var js_files = [
  //bootstrap componenets
  'node_modules/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
  'node_modules/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
  'node_modules/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
  'node_modules/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
  'node_modules/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
  'js/switchery.js'
];

gulp.task('styles', function() {
    return gulp.src(paths.sass)
    	.pipe(sass({
    		outputStyle: 'compressed'
    	}).on('error', sass.logError))
    	.pipe(gulp.dest('./css/'));
});

gulp.task('scripts', function () {
	return gulp.src(js_files)
		.pipe(uglify())
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest('./js/'));
});

gulp.task('build', ['twig', 'styles', 'scripts']);

gulp.task('watch',function() {
    gulp.watch(paths.sass, ['styles']);
    gulp.watch(paths.js, ['scripts']);
    gulp.watch('twig/**/*', ['twig']);
});


gulp.task('default', ['build','watch','sync']);

gulp.task('sync', function() {
    browserSync.init({
        proxy: "localhost/demopage/",
        files: ['index.html','css/*','js/*']
    });
});

gulp.task('twig', function () {
    'use strict';
    return gulp.src('./twig/index.html')
        .pipe(twig({
            data: {
                debug:true,
                title: 'سازمان هواپيمايي کشوري'
            },
            onError:function(){}
        }))
        .pipe(htmlmin({collapseWhitespace: true,removeComments:true,minifyJS:true,minifyCSS:true}))
        .pipe(gulp.dest('./'));
});