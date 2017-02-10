'use strict';

const express       = require('express'),
    path            = require('path'),
    fs              = require('fs'),
    expressJWT      = require('express-jwt'),
    myFunction      = require(path.resolve('utils/route')),
    key             = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    admin           = express.Router();


/*read and load all controllers*/
let ctrls = {};
fs.readdirSync(path.resolve('./controllers')).forEach(file => {
    let name = file.substr(0, file.indexOf('.'));
    ctrls[name] = require(path.resolve(`./controllers/${name}`));
});

/*routes authencation by using express routes*/
admin.use(expressJWT({
    secret: new Buffer(key.secret).toString('base64'),
}).unless({
    path: [
        '/admin/login',
    ]
}));


admin.post('/login', ctrls.admin_controller.login);
admin.post('/changePassword', ctrls.admin_controller.changePassword);

/*CMS routes*/
admin.post('/insert-update-page', myFunction.saveImage(), ctrls.cms_controller.insertUpdate);
admin.get('/get-cms-page', ctrls.cms_controller.showPagesList);
admin.get('/cms-page-by-id', ctrls.cms_controller.editpage);
admin.get('/getTestimonialById', ctrls.admin_controller.testimonialDataToEdit);
admin.get('/delete-cms-page', ctrls.cms_controller.deletePage);
/*end*/


/*testimonial routes*/
admin.post('/insert-update-testimonail', myFunction.saveImage(), ctrls.testimonial_controller.insertUpdateTestimonail);
admin.get('/get-testimonial-data', ctrls.testimonial_controller.testimonialData);
admin.post('/add-testimonial-category', ctrls.testimonial_controller.addTestimonialCategory);
admin.get('/testimonialCategory', ctrls.testimonial_controller.testimonialCategory);
admin.get('/deleteTestimonial', ctrls.admin_controller.deleteTestimonial);

// /*end testimonial routes*/


admin.post('/update-profile', ctrls.admin_controller.updateProfile);
admin.get('/profile-info', ctrls.admin_controller.profileInfo);
admin.post('/insertUpdateFrequentlyAskedQuestion', ctrls.admin_controller.insertUpdateFaq);
admin.get('/faqList', ctrls.admin_controller.showFaqList);
admin.get('/deleteFaqData', ctrls.admin_controller.deleteFaq);
admin.get('/getFaqToedit', ctrls.admin_controller.faqToedit);

admin.post('/addLib', ctrls.admin_controller.addLibary);
admin.get('/getlibraryFeatureData', ctrls.admin_controller.libraryFeatureList);
admin.post('/addLibCat', ctrls.admin_controller.addLibaryCategory);
admin.post('/addLibLab', ctrls.admin_controller.addLibaryLabel);
admin.get('/deleteLibraryData', ctrls.admin_controller.removeLibraryData);
admin.get('/updateLibraryData', ctrls.admin_controller.editAndSaveLibraryData);
admin.get('/showSubCategory', ctrls.admin_controller.viewSubCategory);
admin.post('/assignSubCat', ctrls.admin_controller.assignSubCategory);
admin.post('/addSubCat', ctrls.admin_controller.addSubCategory);
admin.get('/libDropDownList', ctrls.admin_controller.getLibDropDownList);
admin.get('/libRecord', ctrls.admin_controller.libraryRecords);
admin.post('/addUpdateLibCat', ctrls.admin_controller.addUpdateLibCat);
admin.get('/libSubCatRecord', ctrls.admin_controller.librarySubCatRecord);
admin.get('/libPostRecord', ctrls.admin_controller.libraryPostsRecord);
admin.get('/getLibdataToEdit', ctrls.admin_controller.receiveLibDataToEdit);
admin.post('/updateLibRecord', ctrls.admin_controller.updateLibRecord);



/*post routes*/
admin.post('/addUpdatePost', myFunction.saveImage(), ctrls.post_controller.addUpdatePost);
admin.get('/post-data-to-edit', ctrls.post_controller.postDataToEdit);
admin.get('/get-post-data', ctrls.post_controller.getPostData);
admin.delete('/delete-post-data/:id', ctrls.post_controller.delete);


admin.post('/changePassword', ctrls.admin_controller.changePassword);

module.exports = {
    admin: admin
};