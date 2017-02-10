'use strict';
const gulp = require('gulp'),
	map         = require('map-stream'),
    concat      = require('gulp-concat'),	
    pump        = require('pump'),
    uglify      = require('gulp-uglify'),
	stylish     = require('jshint-stylish'),
	nodemon     = require('gulp-nodemon'),
	cleancss    = require('gulp-clean-css'),
	jshint = require('gulp-jshint');


gulp.task('nodemon', () => {
    nodemon({
            tasks: ['jshint'],
            script: 'server.js',
            ext: 'js html',
            ignore: ['node_modules/', 'public/assets/libs/bower_components/','*.html' , 'public/assets/js/'],
        })
        .on('restart', () => {
            console.log('server restarted ...');
        });
});

var exitOnJshintError = map(function (file, cb) {
  if (!file.jshint.success) {
    console.error('fix error first! jshint stopped');
    process.exit(1);
  }
});

gulp.task('jshint', ['minify-internal-javascript-admin'], () => {
    return gulp.src([
           './public/backend/*.js',
        ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(exitOnJshintError);
});

gulp.task('minify-internal-javascript-admin', (cb) => {
    pump([
        gulp.src([
            './public/backend/app.js',
            './public/backend/routes.js',
            './public/backend/factories/*.js',
            './public/backend/includes/factories/*.js',
            './public/backend/landing/controllers/*.js',
            './public/backend/home/controllers/*.js',
            './public/backend/faq/controllers/*.js',
            './public/backend/profile/controllers/*.js',
            './public/backend/cms/controllers/*.js',
            './public/backend/blog/controllers/*.js',
            './public/backend/includes/controllers/*.js',            
            './public/backend/directives/*.js',
            './public/backend/home/directives/*.js'

        ]),
        concat('admin_app.min.js'),
        uglify(),
        gulp.dest('./public/assets/js'),
    ], cb);
});

gulp.task('minify-external-javascript-admin', (cb) => {
    pump([
        gulp.src([
            './public/assets/libs/bower_components/jquery/dist/jquery.min.js',
            './public/assets/libs/bower_components/angular/angular.min.js',
            './public/assets/libs/bower_components/angular-animate/angular-animate.min.js',
            './public/assets/libs/bower_components/angular-aria/angular-aria.min.js',
            './public/assets/libs/bower_components/angular-messages/angular-messages.min.js',
            './public/assets/libs/bower_components/angular-material/angular-material.min.js',
            './public/assets/libs/bower_components/angular-route/angular-route.min.js',
            './public/assets/libs/bower_components/bootstrap/dist/js/bootstrap.min.js',
            './public/assets/libs/bower_components/angular-cookies/angular-cookies.min.js',
            './public/assets/libs/bower_components/angular-ckeditor/angular-ckeditor.min.js',
            './public/assets/libs/bower_components/angular-toasty/dist/angular-toasty.min.js',
            './public/assets/libs/bower_components/ng-dialog/js/ngDialog.min.js',
            './public/assets/libs/bower_components/ng-file-upload/ng-file-upload.min.js',
            './public/assets/libs/bower_components/ng-file-upload/ng-file-upload-shim.min.js',
            './public/assets/libs/bower_components/AdminLTE/dist/js/app.min.js'
        ]),
        concat('admin_site.min.js'),
        uglify(),
        gulp.dest('./public/assets/js'),
    ], cb);
});



gulp.task('minify-external-css-admin', () => {
    gulp.src([
        './public/assets/libs/bower_components/angular-material/angular-material.min.css',
        './public/assets/libs/bower_components/bootstrap/dist/css/bootstrap.min.css',
        './public/assets/libs/bower_components/angular-toasty/dist/angular-toasty.min.css',
        './public/assets/libs/bower_components/AdminLTE/dist/css/AdminLTE.min.css',
        './public/assets/libs/bower_components/AdminLTE/dist/css/skins/_all-skins.min.css'
    ])
    .pipe(concat('admin_site.min.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('./public/assets/css/backend'));
});

gulp.task('minify-internal-css-admin', () => {
    gulp.src([
        './public/assets/css/backend/style.css'
    ])
    .pipe(concat('admin_app.min.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('./public/assets/css/backend'));
});

gulp.task('default', ['nodemon', 'jshint', 'minify-external-javascript-admin', 'minify-internal-javascript-admin', 'minify-external-css-admin', 'minify-internal-css-admin'], function() {
	console.log("gulp tasks completed");
});



