'use strict';

const express       = require('express'),
    path            = require('path'),
    fs              = require('fs'),
    querystring     = require('querystring'),
    expressJWT      = require('express-jwt'),
    myFunction      = require(path.resolve('./modules/utils/route')),
    key             = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    admin           = express.Router(),
    user            = express.Router();



/*read and load admin controllers*/

let ctrls = {};
fs.readdirSync(path.resolve('./modules/backend/controllers')).forEach(file => {
    let name = file.substr(0, file.indexOf('.'));
    ctrls[name] = require(path.resolve(`./modules/backend/controllers/${name}`));
});


/*read and load user controllers*/

let userCtrls = {};
fs.readdirSync(path.resolve('./modules/frontend/controllers')).forEach(file => {
    let name = file.substr(0, file.indexOf('.'));
    userCtrls[name] = require(path.resolve(`./modules/frontend/controllers/${name}`));
});


/*routes authencation by using express routes*/
admin.use(expressJWT({
    secret: new Buffer(key.secret).toString('base64'),
}).unless({
    path: [
        '/admin/login',
    ]
}));


user.get('/test-function', userCtrls.index.test);

/*login route*/
admin.post('/login', ctrls.admin_controller.login);
admin.get('/get-all-count', ctrls.admin_controller.getCount);


/*CMS routes*/
admin.post('/insert-update-page', myFunction.saveImage(), ctrls.cms_controller.insertUpdate);
admin.get('/get-cms-page', ctrls.cms_controller.showPagesList);
admin.get('/cms-page-by-id', ctrls.cms_controller.editpage);
admin.get('/delete-cms-page', ctrls.cms_controller.deletePage);
/*end*/



/*testimonial routes*/
admin.post('/insert-update-testimonail', myFunction.saveImage(), ctrls.testimonial_controller.insertUpdateTestimonail);
admin.get('/get-testimonial-data', ctrls.testimonial_controller.testimonialData);
admin.post('/add-testimonial-category', ctrls.testimonial_controller.addTestimonialCategory);
admin.get('/testimonialCategory', ctrls.testimonial_controller.testimonialCategory);

 /*end testimonial routes*/




/*profile routes*/

admin.post('/update-profile', ctrls.admin_controller.updateProfile);
admin.get('/profile-info', ctrls.admin_controller.profileInfo);
admin.post('/changePassword', ctrls.admin_controller.changePassword);

/*end profile routes*/




/*FAQs routes*/

admin.post('/insert-update-faq', ctrls.faq_controller.insertUpdateFaq);
admin.get('/faq-list', ctrls.faq_controller.showFaqList);
admin.get('/move-to-trash-faq', ctrls.faq_controller.trashFaq);
admin.get('/faq-detail', ctrls.faq_controller.faqDetail);

/*end FAQs routes*/








/*blogs-post routes*/

admin.post('/add-update-post', myFunction.saveImage(), ctrls.post_controller.addUpdatePost);
admin.get('/post-info', ctrls.post_controller.postInfo);
admin.get('/posts-list', ctrls.post_controller.getPostsList);
admin.get('/search-post', ctrls.post_controller.search);
admin.delete('/delete-post/:id', ctrls.post_controller.deletePost);

/*end blog-post routes*/


/*category routes*/
admin.get('/category-list', ctrls.category_controller.categortList);
admin.post('/add-update-category', ctrls.category_controller.insertUpdateCategory);
admin.get('/category-info/:id', ctrls.category_controller.categoryInfo);
admin.delete('/delete-category/:id', ctrls.category_controller.deleteCategory);
admin.get('/category-drop-down-list', ctrls.category_controller.dropDownList);

/*end category routes*/
module.exports = {
    admin: admin,
    user: user
};