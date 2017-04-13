'use strict';
const path 	= require('path'),
multer      = require('multer'),
_ 			= require('lodash'),
config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
fs 			= require('fs');

/* Require All the controllers */
let ctrls = {};
fs.readdirSync(path.resolve('./controllers/User')).forEach(file => {
	let name = file.substr(0,file.indexOf('.'));
	ctrls[name] = require(path.resolve(`./controllers/User/${name}`));
});

/* Property image upload using multer */
let uploadProperty = multer({
    dest: config.property_image_destination,
    limits: config.fileLimits,
    storage: multer.memoryStorage(),
    fileFilter: fileFilter
});

// User Profile image upload
let profileImage = multer({
    
    limits: config.fileLimits,
    storage: multer.diskStorage({
    	destination: 'public/images/profile/',
    	filename: function (req, file, cb) {
    		cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
  		}
    }),
    fileFilter: fileFilter
    
});

/* Check if file is valid image */
function fileFilter (req, file, cb) {
	if(!_.includes(config.allowed_image_extensions, file.mimetype)){
		cb(new Error('Invalid image file'));
	}
	cb(null, true);
}


module.exports = {
  	routes: [
  		{ url: '/login', method: ctrls.usersCtrl.login, type: 'POST' },
		{ url: '/register', method: ctrls.usersCtrl.register, type: 'POST' },
		{ url: '/verifyEmail/:salt', method: ctrls.usersCtrl.verifyEmail, type: 'GET' },
		{ url: '/forgot', method: ctrls.usersCtrl.forgot, type: 'POST' },
		{ url: '/reset/:token', method: ctrls.usersCtrl.validateResetToken, type: 'GET' },
		{ url: '/reset/:token', method: ctrls.usersCtrl.reset, type: 'PUT' },
		{ url: '/emails_notifications', method: ctrls.emailCtrl.getDeliveredEmails, type: 'POST' },
		{ url: '/emails_list', method: ctrls.emailCtrl.getEmailList, type: 'GET' },
		{ url: '/update_account/:id', mwear: profileImage.any(), method: ctrls.profileCtrl.updateAccount, type: 'SPECIALPUT' },
		{ url: '/bank_detail/:id', method: ctrls.landlordCtrl.landlordBankDetail, type: 'PUT' },
		{ url: '/bank_detail/:userid/:id', method: ctrls.landlordCtrl.landlordDeleteBankDetail, type: 'DELETE' },
		{ url: '/make_primary_bank/:userid', method: ctrls.landlordCtrl.makePrimaryBankDetail, type: 'PUT' },
		{ url: '/change_password/:id', method: ctrls.profileCtrl.changePassword, type: 'PUT' },
		{ url: '/update_email/:id', method: ctrls.profileCtrl.updateEmail, type: 'PUT' },
		{ url: '/deactive_user/:id', method: ctrls.profileCtrl.deactiveUser, type: 'PUT' },
		{ url: '/property', mwear: uploadProperty.any(), method: ctrls.propertyCtrl.uploadProperty, type: 'SPECIALPOST' },
		{ url: '/update_property', mwear: uploadProperty.any(), method: ctrls.propertyCtrl.update_property, type: 'SPECIALPOST' },
		{ url: '/paginate_property/:userid', method: ctrls.propertyCtrl.paginate, type: 'GET' },
		{ url: '/property_detail/:slug', method: ctrls.propertyCtrl.propertyBySlug, type: 'GET' },
		{ url: '/property/:id', method: ctrls.propertyCtrl.updateProperty, type: 'PUT' },
		{ url: '/property/:id', method: ctrls.propertyCtrl.deleteProperty, type: 'DELETE' },
		{ url: '/remove_property_photo/:id', method: ctrls.propertyCtrl.removePropertyPhoto, type: 'PUT' },
		{ url: '/remove_item/:property_id/:cart_id', method: ctrls.propertyCtrl.updateCartServices, type: 'PUT' },
		{ url: '/checkout/:id', method: ctrls.propertyCtrl.checkout, type: 'PUT' },
		{ url: '/search', method: ctrls.propertyCtrl.search, type: 'POST' },
		{ url: '/property_additionals/:type', method: ctrls.propertyCtrl.propertyAdditionals, type: 'GET' },		
		{ url: '/save_property/:userid', method: ctrls.usersCtrl.saveProperty, type: 'PUT' },
		{ url: '/save_property/:userid', method: ctrls.usersCtrl.getSaveProperties, type: 'GET' },
		{ url: '/profile/:id', method: ctrls.usersCtrl.profileById, type: 'GET' },
		{ url: '/refresh_token', method: ctrls.usersCtrl.generateToken, type: 'POST' },
		{ url: '/save_search/:userid', method: ctrls.usersCtrl.get_save_search, type: 'GET' },
		{ url: '/save_search/:userid', method: ctrls.usersCtrl.set_save_search, type: 'PUT' },
		{ url: '/save_search/:id/:userid', method: ctrls.profileCtrl.delete_saved_search, type: 'DELETE' },
		{ url: '/toggle_search_alert/:userid', method: ctrls.profileCtrl.toggleSearchAlert, type: 'PUT' },
		{ url: '/become_franchisee_request', method: ctrls.franchisee_ctrl.becomeFranchisee, type: 'POST' },
		{ url: '/enquiry/:landlordid/:tenantid', method: ctrls.enquiryCtrl.tenantEnquiry, type: 'PUT' },
		{ url: '/enquiry/:landlordid', method: ctrls.enquiryCtrl.getEnquiries, type: 'GET' },
		{ url: '/enquiry_status/:landlordid', method: ctrls.enquiryCtrl.toggleStatus, type: 'PUT' },
		{ url: '/organize_referencing/:landlordid', method: ctrls.enquiryCtrl.organizeReferencing, type: 'PUT' },
		{ url: '/checkout_additional_service_list/:slug', method: ctrls.checkoutCtrl.additionalServiceList, type: 'GET' },
		{ url: '/successfull_payment', method: ctrls.checkoutCtrl.paymentSuccessful, type: 'POST' },
		{ url: '/save_alert_records', method: ctrls.cronsCtrl.saveAlertsRecords, type: 'GET' },
		{ url: '/get_immediately_search_alerts', method: ctrls.cronsCtrl.getImmediatelySearchAlerts, type: 'GET' }
		
	]
};