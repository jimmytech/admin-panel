'use strict';

const express       = require('express'),
    path            = require('path'),
    fs              = require('fs'),
    querystring     = require('querystring'),
    expressJWT      = require('express-jwt'),
    multer      = require(path.resolve('./config/libs/multer')),
    key             = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    router           = express.Router();



/*read and load admin controllers*/

let adminCtrls = {};
fs.readdirSync(path.resolve('./modules/backend/controllers')).forEach(file => {
    let name = file.substr(0, file.indexOf('.'));
    adminCtrls[name] = require(path.resolve(`./modules/backend/controllers/${name}`));
});


/*read and load user controllers*/

let userCtrls = {};
fs.readdirSync(path.resolve('./modules/frontend/controllers')).forEach(file => {
    let name = file.substr(0, file.indexOf('.'));
    userCtrls[name] = require(path.resolve(`./modules/frontend/controllers/${name}`));
});


/*routes authencation by using express routes*/

router.use(expressJWT({
    secret: new Buffer(key.secret).toString('base64'),
}).unless({
    path: [
        '/admin/login',
        '/user-login',
        '/user-signup',
        '/favicon.ico'
    ]
}));

/*login route*/

router.post('/login', adminCtrls.admin_controller.login);
router.get('/get-all-count', adminCtrls.admin_controller.getCount);
router.get('/count-on-dashboard', adminCtrls.admin_controller.getCountOnDashboard);


router.get('/user-list', adminCtrls.user_controller.userList);
router.get('/search-user', adminCtrls.user_controller.search);
router.post('/update-user', adminCtrls.user_controller.updateUser);

/*CMS routes*/

router.post('/insert-update-page', multer.saveImage(), adminCtrls.cms_controller.insertUpdate);
router.get('/get-cms-page', adminCtrls.cms_controller.showPagesList);
router.get('/cms-page-by-id', adminCtrls.cms_controller.editpage);
router.get('/delete-cms-page', adminCtrls.cms_controller.deletePage);

/*end*/


/*profile routes*/

router.post('/update-profile', adminCtrls.admin_controller.updateProfile);
router.get('/profile-info', adminCtrls.admin_controller.profileInfo);
router.post('/changePassword', adminCtrls.admin_controller.changePassword);
router.post('/user-registration', adminCtrls.admin_controller.signUp);
router.post('/temp-remove-user/:id', adminCtrls.admin_controller.trash);
router.get('/user-detail-by-id', adminCtrls.admin_controller.userInfo);

/*end profile routes*/




/*FAQs routes*/

router.post('/insert-update-faq', adminCtrls.faq_controller.insertUpdateFaq);
router.get('/faq-list', adminCtrls.faq_controller.showFaqList);
router.get('/move-to-trash-faq', adminCtrls.faq_controller.trashFaq);
router.get('/faq-detail', adminCtrls.faq_controller.faqDetail);

/*end FAQs routes*/


/*blogs-post routes*/

router.post('/add-update-post', multer.saveImage(), adminCtrls.post_controller.addUpdatePost);
router.get('/post-info', adminCtrls.post_controller.postInfo);
router.get('/posts-list', adminCtrls.post_controller.getPostsList);
router.get('/search-post', adminCtrls.post_controller.search);
router.delete('/delete-post/:id', adminCtrls.post_controller.deletePost);

/*end blog-post routes*/


/*category routes*/
router.get('/category-list', adminCtrls.category_controller.categortList);
router.post('/add-update-category', multer.saveImage(), adminCtrls.category_controller.insertUpdateCategory);
router.get('/category-info/:id', adminCtrls.category_controller.categoryInfo);
router.delete('/delete-category/:id', adminCtrls.category_controller.deleteCategory);


/*service routes*/

router.get('/service-list',  adminCtrls.service_controller.serviceList);
router.get('/service-info/:id',  adminCtrls.service_controller.serviceInfo);
router.post('/insert-update-service',  adminCtrls.service_controller.insertUpdateService);
router.delete('/delete-service/:id',  adminCtrls.service_controller.trash);







/*user routes*/

router.post('/user-signup', userCtrls.user_controller.signup);
router.post('/user-login', userCtrls.user_controller.login);
router.post('/update-user-profile', userCtrls.user_controller.updateProfile);
router.post('/change-password', userCtrls.profile_controller.changePassword);
router.post('/is-active', userCtrls.profile_controller.activeInactive);
router.post('/notification-setting', userCtrls.profile_controller.activeInactiveNotification);
router.get('/refer-to-friend/:email', userCtrls.refer_controller.referToFriend);

router.post('/update-user-profile-image', multer.saveImage(), userCtrls.profile_controller.updateProfileImage);

router.get('/get-suburb-list', adminCtrls.suburb_controller.suburbList);

/*get category service list*/
router.get('/category-service-list', userCtrls.category_service_controller.categoryServiceList);
router.post('/save-category-data', userCtrls.category_service_controller.saveCategoryInfo);
/*end category routes*/


module.exports = {
    router: router
};