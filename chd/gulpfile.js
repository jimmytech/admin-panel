'use strict';

const gulp      = require('gulp'),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    nodemon     = require('gulp-nodemon'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    cleancss    = require('gulp-clean-css'),
    pump        = require('pump'),
    map         = require('map-stream'),
    notify      = require('gulp-notify'),
    fs          = require('fs');

/*
 * This package is used for restart node server every our server file changes
 * source: https://www.npmjs.com/package/nodemon
 */

gulp.task('nodemon', () => {
    nodemon({
            tasks: ['jshint'],
            script: 'server.js',
            ext: 'js html',
            ignore: ['node_modules/', 'public/bower_components/', 'public/js/', 'test/', 'coverage/', 'public/images/','public/css/fonts/','*.html'],
        })
        .on('restart', () => {
            gulp.src('server.js')
            .pipe(notify('Task completed. nodemon restarted'));
        });
});

var exitOnJshintError = map(function (file, cb) {
  if (!file.jshint.success) {
    console.error('jshint failed');
    process.exit(1);
  }
});

/*
 * JSHint to lint all the js files
 */

gulp.task('jshint', ['minifyAdminInternalJs','app:uglify'], () => {
    return gulp.src([
            './config/**/*.js',
            './config/*.js',
            './controllers/*.js',
            './models/*.js',
            './public/assets/user/app.js',
            './public/assets/user/core/*.js',
            './public/assets/user/auth/*.js',
            './public/assets/user/home/*.js',
            './public/assets/user/profile/*.js',
            './public/assets/user/properties/*.js',
            './public/assets/user/search/*.js',
            './public/assets/user/professional-trader/*.js',
            './public/assets/user/directives/*.js',
            './public/assets/user/factories/*.js',
            './public/assets/user/controllers/*.js',
            './public/assets/user/franchisee/*.js',
            './public/assets/user/landlord/*.js',
            './public/assets/user/landlord/directives/*.js',
            './public/assets/admin/config/*.js',
            ' /public/assets/admin/services/*.js',
            './public/assets/admin/controllers/*.js',

        ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(exitOnJshintError);
});

/*
minify external Js files for admin
*/
gulp.task('minifyAdminExternalJs', (cb) => {
    pump([
        gulp.src([
            './public/bower_components/jquery/dist/jquery.min.js',
            './public/bower_components/angular/angular.min.js',
            './public/bower_components/angular-route/angular-route.min.js',
            './public/bower_components/angular-animate/angular-animate.min.js',
            './public/bower_components/angular-aria/angular-aria.min.js',
            './public/bower_components/angular-messages/angular-messages.min.js',
            './public/bower_components/angular-material/angular-material.min.js',
            './public/bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
            './public/bower_components/angular-sanitize/angular-sanitize.min.js',
            './public/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
            './public/bower_components/angular-auto-validate/dist/jcs-auto-validate.min.js',
            './public/bower_components/angular-strap/dist/angular-strap.min.js',
            './public/bower_components/angular-strap/dist/angular-strap.tpl.min.js',
            './public/bower_components/angulartics/dist/angulartics.min.js',
            './public/bower_components/ng-csv/build/ng-csv.min.js',
            './public/bower_components/ng-dialog/js/ngDialog.min.js',
            './public/bower_components/angular-cookies/angular-cookies.min.js',
            './public/bower_components/dropzone/dist/min/dropzone.min.js',
            './public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            './public/bower_components/textAngular/dist/textAngular-rangy.min.js',
            './public/bower_components/textAngular/dist/textAngular-sanitize.min.js',
            './public/bower_components/textAngular/dist/textAngular.min.js',
            './public/bower_components/pdfmake/build/pdfmake.min.js',
            './public/bower_components/pdfmake/build/vfs_fonts.js',
            './public/js/admin/themeFiles/side-nav.js',
            './public/js/admin/themeFiles/ripples.js',
            './public/js/admin/themeFiles/colors.js',
            './public/js/admin/themeFiles/bootbox.min.js'
        ]),
        concat('admin-site.min.js'),
        uglify(),
        gulp.dest('./public/js/admin'),
    ], cb);
});

/*
minify admin Js files
*/

gulp.task('minifyAdminInternalJs', (cb) => {
    pump([
        gulp.src([
        './public/assets/admin/config/app.js',
    ]),
    concat('admin-app.js'),
    uglify(),
    gulp.dest('./public/js/admin')
    ], cb);

});


gulp.task('admin-site:cssmin', () => {
    gulp.src([
        './public/css/admin/themeFiles/materialism.css',
        './public/bower_components/ng-dialog/css/ngDialog.min.css',
        './public/bower_components/ng-dialog/css/ngDialog-theme-default.min.css',
        './public/bower_components/ng-dialog/css/ngDialog-theme-plain.min.css',
        './public/bower_components/ng-dialog/css/ngDialog-custom-width.css',
        './public/css/admin/themeFiles/helpers.css',
        './public/bower_components/dropzone/dist/min/dropzone.min.css',
         './public/bower_components/bootstrap-additions/dist/bootstrap-additions.css',
         './public/bower_components/angular-material/angular-material.min.css',
         './public/bower_components/textAngular/dist/textAngular.css'

    ])
    .pipe(concat('admin-site.min.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('./public/css/admin'));
});

/*
minify external Js files for  front-end
*/


gulp.task('site:uglify', (cb) => {
    pump([
        gulp.src([
            './public/bower_components/jquery/dist/jquery.min.js',
            './public/bower_components/owl.carousel/dist/owl.carousel.min.js',
            './public/bower_components/angular/angular.min.js',
            './public/bower_components/angular-animate/angular-animate.js',
            './public/bower_components/angular-aria/angular-aria.js',
            './public/bower_components/angular-messages/angular-messages.js',
            './public/bower_components/angular-material/angular-material.min.js',
            './public/bower_components/angular-route/angular-route.min.js',
            './public/bower_components/angular-loading-bar/build/loading-bar.min.js',
            './public/bower_components/angular-sanitize/angular-sanitize.min.js',
            './public/bower_components/angular-local-storage/dist/angular-local-storage.js',
            './public/bower_components/bootstrap/dist/js/bootstrap.min.js',
            './public/bower_components/dropzone/dist/min/dropzone.min.js',
            './public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            './public/bower_components/ngmap/build/scripts/ng-map.min.js',
            './public/bower_components/moment/min/moment.min.js',
            './public/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
            './public/bower_components/ng-scrollbars/dist/scrollbars.min.js',
            './public/bower_components/ng-img-crop/compile/minified/ng-img-crop.js',
            './public/bower_components/ng-file-upload/ng-file-upload-shim.min.js',
            './public/bower_components/ng-file-upload/ng-file-upload.min.js',
            './public/bower_components/fancybox-plus/dist/jquery.fancybox-plus.min.js',
            './public/bower_components/angular-fancybox-plus/js/angular-fancybox-plus.js',
            './public/bower_components/intro.js/minified/intro.min.js',
            './public/bower_components/angular-intro.js/build/angular-intro.min.js'
        ]),
        concat('site.min.js'),
        uglify(),
        gulp.dest('./public/js/user')
    ],cb);

});

/*
* This task is will minify all the angular modules files
* @ front-end
*/
gulp.task('app:uglify', (cb) => {
    pump([
        gulp.src([
            './public/assets/user/app.js',
            './public/assets/user/factories/*.js',
            './public/assets/user/core/*.js',
            './public/assets/user/auth/*.js',
            './public/assets/user/home/*.js',
            './public/assets/user/profile/*.js',
            './public/assets/user/properties/*.js',
            './public/assets/user/search/*.js',           
            './public/assets/user/professional-trader/*.js',            
            './public/assets/user/filters/*.js',
            './public/assets/user/controllers/*.js',
            './public/assets/user/franchisee/*.js',
            './public/assets/user/landlord/*.js',            
            './public/assets/user/partials/*.js',
            './public/assets/user/partials/directives/*.js',   
             './public/assets/user/profile/directives/*.js',         
            './public/assets/user/landlord/directives/*.js',
            './public/assets/user/tenant/directives/*.js',
            './public/assets/user/directives/*.js'
        ]),
        concat('app.min.js'),
        uglify(),
        gulp.dest('./public/js/user')
    ],cb);
});

/*
* This task will minify all the css files
* @ front-end
*/
gulp.task('app:cssmin', () => {
    gulp.src([
        './public/bower_components/angular-material/angular-material.min.css',
        './public/bower_components/owl.carousel/dist/assets/owl.carousel.min.css',
        './public/bower_components/angular-loading-bar/build/loading-bar.min.css',
        './public/bower_components/bootstrap/dist/css/bootstrap.min.css',
        './public/bower_components/dropzone/dist/min/dropzone.min.css',
        './public/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css',
        './public/bower_components/ng-img-crop/compile/minified/ng-img-crop.css',
        './public/bower_components/fancybox-plus/css/jquery.fancybox-plus.css',
        './public/bower_components/intro.js/minified/introjs.min.css'
    ])
    .pipe(concat('site.min.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('./public/css/'));
});



/*
* To check whether .env file exists or not
* if not exists, create the file and write the env variable
*/
gulp.task('check:env', () => {
    fs.stat(`${__dirname}/.env`, (err, success) => {
        if(err){
            try{
                let path = `${__dirname}/.env`;
                if(fs.openSync(path,'w')){
                    fs.writeFileSync(path,'NODE_ENV=cherrydoor-local');
                }
            } catch(e){
                console.error(`System is unable to create ".env" file, please create ".env" file in root directory and specify the "NODE_ENV" to either one of these (cherrydoor-local, cherrydoor-dev, cherrydoor-qa, test, production) eg. NODE_ENV=cherrydoor-local`);
            }
        }
    });
});

gulp.task('default', [
    'check:env',
    'jshint',
    'nodemon',
    'site:uglify',
    'app:uglify',
    'app:cssmin',
    'admin-site:cssmin',
    'minifyAdminInternalJs',
    'minifyAdminExternalJs'
], function() {
    console.log("gulp all tasks finished");
});
