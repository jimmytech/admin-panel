'use strict';

const gulp = require('gulp'),
	map         = require('map-stream'),
    concat      = require('gulp-concat'),	
    pump        = require('pump'),
    uglify      = require('gulp-uglify'),
	stylish     = require('jshint-stylish'),
	nodemon     = require('gulp-nodemon'),
	cleancss    = require('gulp-clean-css'),
	jshint      = require('gulp-jshint');


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


var exitOnJshintError = map( (file, cb) => {
  if (!file.jshint.success) {
    console.error('fix error first! jshint stopped');
    process.exit(1);
  }
});


gulp.task('jshint', [
     'minify-internal-js-admin',
     'minify-internal-js',
     'minify-internal-css-admin',
     'minify-internal-css'], () => {
    return gulp.src([

           './modules/*/*/*.js',
           './modules/*/*.js',           
           './public/backend/*.js',
           './public/backend/*/*.js',
           './public/backend/*/*/*.js',
           './config/*.js',
           './config/*/*.js',
           './public/frontend/*/*/*.js',
        ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(exitOnJshintError);
});


/* minify internal javascript code for admin*/

gulp.task('minify-internal-js-admin', (cb) => {
    pump([
        gulp.src([
            './public/backend/app.js',
            './public/backend/routes.js',
            './public/backend/factories/*.js',
            './public/backend/values/*.js',
            './public/backend/includes/factories/*.js',
            './public/backend/landing/controllers/*.js',
            './public/backend/dashboard/controllers/*.js',
            './public/backend/faq/controllers/*.js',
            './public/backend/profile/controllers/*.js',
            './public/backend/cms/controllers/*.js',
            './public/backend/blog/controllers/*.js',
            './public/backend/users/controllers/*.js',
            './public/backend/includes/controllers/*.js',            
            './public/backend/Categories/controllers/*.js',            
            './public/backend/directives/*.js',
            './public/backend/dashboard/directives/*.js'        

        ]),
        concat('admin_app.min.js'),
        uglify(),
        gulp.dest('./public/assets/js'),
    ], cb);
});


/*minify internal javascript code for frontend user*/

gulp.task('minify-internal-js', (cb) => {
    pump([
        gulp.src([
             './public/frontend/*.js',
             './public/frontend/factroies/*.js',
             './public/backend/factories/socket_service.js',   //include socket service from backend part
             './public/frontend/includes/*/*.js',
             './public/frontend/directives/*.js',
             './public/frontend/landing/*/*.js',
             './public/frontend/home/*/*.js',
             './public/frontend/profile/*/*.js',
             './public/frontend/cms/*/*.js',
             './public/frontend/settings/*/*.js',
             './public/frontend/refer/*/*.js',
             './public/frontend/popup/*/*.js'
             
            ]),
        
        concat('app.min.js'),
        uglify(),
        gulp.dest('./public/assets/js'),
        
        ], cb)
});


/*minify external javascript for admin*/

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
            './public/assets/libs/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            './public/assets/libs/bower_components/angular-cookies/angular-cookies.min.js',
            './public/assets/libs/bower_components/angular-ckeditor/angular-ckeditor.min.js',
            './public/assets/libs/bower_components/angular-toasty/dist/angular-toasty.min.js',
            './public/assets/libs/bower_components/socket.io.client/dist/socket.io-1.3.5.js',
            './public/assets/libs/bower_components/ng-file-upload/ng-file-upload.min.js',
            './public/assets/libs/bower_components/ng-file-upload/ng-file-upload-shim.min.js',
            './public/assets/libs/bower_components/AdminLTE/dist/js/app.min.js'
        ]),
        concat('admin_site.min.js'),
        uglify(),
        gulp.dest('./public/assets/js'),
    ], cb);
});


/*minify external javascript for frontend*/

gulp.task('minify-external-javascript', (cb) => {
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
            './public/assets/libs/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            './public/assets/libs/bower_components/angular-cookies/angular-cookies.min.js',
            './public/assets/libs/bower_components/moment/moment.js',
            './public/assets/libs/bower_components/angular-toasty/dist/angular-toasty.min.js',
            // './public/assets/libs/bower_components/ng-file-upload/ng-file-upload.min.js',
            // './public/assets/libs/bower_components/ng-file-upload/ng-file-upload-shim.min.js',

        ]),
        concat('site.min.js'),
        uglify(),
        gulp.dest('./public/assets/js'),
    ], cb);
});


/*minify external css for admin*/

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


/*minify external css for frontend*/

gulp.task('minify-external-css', () => {
    gulp.src([
        './public/assets/libs/bower_components/angular-material/angular-material.min.css',
        './public/assets/libs/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css',
        './public/assets/libs/bower_components/bootstrap/dist/css/bootstrap.min.css',
        './public/assets/libs/bower_components/angular-toasty/dist/angular-toasty.min.css',
    ])
    .pipe(concat('site.min.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('./public/assets/css/frontend'));
});


/*minify internal css for admin*/

gulp.task('minify-internal-css-admin', () => {
    gulp.src([
        './public/assets/css/backend/admin_style.css'
    ])
    .pipe(concat('admin_app.min.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('./public/assets/css/backend'));
});


/*minify internal css for frontend*/

gulp.task('minify-internal-css', () => {
    gulp.src([
        './public/assets/css/frontend/style.css',
        './public/assets/css/frontend/dev.css'
        ])
    .pipe(concat('app.min.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('./public/assets/css/frontend'));
});

gulp.task('default', [
     'nodemon',
     'jshint',
     'minify-external-javascript-admin', 
     'minify-external-javascript', 
     'minify-internal-js-admin', 
     'minify-internal-js', 
     'minify-external-css-admin',
     'minify-external-css', 
     'minify-internal-css-admin',
     'minify-internal-css'
     ], () => {
	console.log("gulp tasks completed");
});



