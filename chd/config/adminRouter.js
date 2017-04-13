'use strict';
const path = require('path'),
    multer = require('multer'),
    _ = require('lodash'),
    config = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    fs = require('fs');

// Require All the controllers 

let ctrls = {};
fs.readdirSync(path.resolve('./controllers/Admin')).forEach(file => {
    let name = file.substr(0, file.indexOf('.'));
    ctrls[name] = require(path.resolve(`./controllers/Admin/${name}`));
});


module.exports = {
    routes: [
        { url: '/login',
            method: ctrls.admin_ctrl.login,
            type: 'POST'
        },
        {
            url: '/register',
            method: ctrls.admin_ctrl.register,
            type: 'POST'
        },
        {
            url: '/forgot',
            method: ctrls.admin_ctrl.register,
            type: 'POST'
        },
        {
            url: '/reset/:token',
            method: ctrls.admin_ctrl.validateResetToken,
            type: 'GET'
        },
        {
            url: '/getUserList',
            method: ctrls.admin_ctrl.userList,
            type: 'GET'
        },
        {
            url: '/getUserCount',
            method: ctrls.admin_ctrl.userCount,
            type: 'GET'
        },
        {
            url: '/delete',
            method: ctrls.admin_ctrl.deleteUser,
            type: 'GET'
        },
        {
            url: '/changeStatus',
            method: ctrls.admin_ctrl.activeInactive,
            type: 'GET'
        },
        {
            url: '/newAccountByAdmin',
            method: ctrls.admin_ctrl.signupByAdmin,
            type: 'POST'
        },
        {
            url: '/getUserDetail',
            method: ctrls.admin_ctrl.viewUserDetail,
            type: 'GET'
        },
        {
            url: '/updateUserDetail',
            method: ctrls.admin_ctrl.updateUser,
            type: 'POST'
        },
        {
            url: '/exportRecord',
            method: ctrls.admin_ctrl.exportDataToCsv,
            type: 'GET'
        },
        {
            url: '/updateProfile',
            method: ctrls.admin_ctrl.updateMyProfile,
            type: 'POST'
        },
        {
            url: '/changePassword',
            method: ctrls.admin_ctrl.changeMyPassword,
            type: 'POST'
        },
        {
            url: '/generate-password/:token',
            method: ctrls.admin_ctrl.verifyGenratePasswordRequest,
            type: 'GET'
        },



        /*subscription plan management routes*/
        {
            url: '/insertPlanService',
            method: ctrls.plan_management_ctrl.addService,
            type: 'POST'
        },
        {
            url: '/insertPlanAdditionalService',
            method: ctrls.plan_management_ctrl.addAdditionalService,
            type: 'POST'
        },
        {
            url: '/insertPlan',
            method: ctrls.plan_management_ctrl.addSubscriptionPlan,
            type: 'POST'
        },
        {
            url: '/updateSubscriptionPlan',
            method: ctrls.plan_management_ctrl.updateSubscriptionPlan,
            type: 'POST'
        },
        {
            url: '/getServiceNameById',
            method: ctrls.plan_management_ctrl.serviceNameById,
            type: 'GET'
        },
        {
            url: '/getAdditionalServiceNameById',
            method: ctrls.plan_management_ctrl.additionalServiceNameById,
            type: 'GET'
        },
        {
            url: '/GetPlanToEdit',
            method: ctrls.plan_management_ctrl.planDetailToEdit,
            type: 'GET'
        },
        {
            url: '/getSubscriptionRecords',
            method: ctrls.plan_management_ctrl.planAndServiceListing,
            type: 'GET'
        },
        {
            url: '/updatePlanStatus',
            method: ctrls.plan_management_ctrl.activeInactive,
            type: 'POST'
        },
        {
            url: '/updateService',
            method: ctrls.plan_management_ctrl.updateServices,
            type: 'POST'
        },
        {
            url: '/updateAdditionalService',
            method: ctrls.plan_management_ctrl.updateAdditionalServices,
            type: 'POST'
        },
        /*end*/

        /*property routes*/
        {
            url: '/getPropertyListing',
            method: ctrls.property_management_ctrl.propertyListing,
            type: 'GET'
        },
        {
            url: '/searchProperty',
            method: ctrls.property_management_ctrl.searchProperty,
            type: 'GET'
        },
        {
            url: '/getPropertyInfo',
            method: ctrls.property_management_ctrl.propertyInfo,
            type: 'GET'
        },
        {
            url: '/userRecords',
            method: ctrls.property_management_ctrl.userList,
            type: 'GET'
        },
        {
            url: '/find',
            method: ctrls.property_management_ctrl.searchUser,
            type: 'GET'
        },
        {
            url: '/updatePropertyDetail',
            method: ctrls.property_management_ctrl.updateProperty,
            type: 'POST'
        },
        {
            url: '/deleteProperty/:key',
            method: ctrls.property_management_ctrl.deletePropertyInfo,
            type: 'DELETE'
        },
        /*end*/

        /*additional exclusion routes*/
        {
            url: '/get-additional-exclusion-list',
            method: ctrls.additional_exclusion_ctrl.additionalExclusionList,
            type: 'GET'
        },
        {
            url: '/new-additional-exclusion',
            method: ctrls.additional_exclusion_ctrl.addAdditionalExclusion,
            type: 'POST'
        },
        {
            url: '/get-additional-exclusion',
            method: ctrls.additional_exclusion_ctrl.getAdditionalExclusionDetail,
            type: 'GET'
        },
        {
            url: '/update-additional-exclusion/:id',
            method: ctrls.additional_exclusion_ctrl.update,
            type: 'PUT'
        },
        {
            url: '/active-inactive-additional-exclusion/:id',
            method: ctrls.additional_exclusion_ctrl.activeInactive,
            type: 'PUT'
        },
        {
            url: '/delete-additional-exclusion/:id',
            method: ctrls.additional_exclusion_ctrl.delete,
            type: 'DELETE'
        },
        /*end*/

        /*editional frature routes*/
        {
            url: '/new-additional-feature',
            method: ctrls.additional_feature_ctrl.addAdditionalFeature,
            type: 'POST'
        },
        {
            url: '/get-additional-feature-list',
            method: ctrls.additional_feature_ctrl.additionalFeatureList,
            type: 'GET'
        },
        {
            url: '/get-additional-feature',
            method: ctrls.additional_feature_ctrl.getAdditionalFeatureDetail,
            type: 'GET'
        },
        {
            url: '/update-additional-feature/:id',
            method: ctrls.additional_feature_ctrl.update,
            type: 'PUT'
        },
        {
            url: '/active-inactive-additional-feature/:id',
            method: ctrls.additional_feature_ctrl.activeInactive,
            type: 'PUT'
        },
        {
            url: '/delete-additional-feature/:id',
            method: ctrls.additional_feature_ctrl.delete,
            type: 'DELETE'
        },
        /*end*/

        /*property options routes*/
        {
            url: '/newOptionType',
            method: ctrls.property_option_ctrl.addNewType,
            type: 'POST'
        },
        {
            url: '/get-options',
            method: ctrls.property_option_ctrl.getData,
            type: 'GET'
        },
        {
            url: '/get-option-edit',
            method: ctrls.property_option_ctrl.getDataToedit,
            type: 'GET'
        },
        {
            url: '/active-inactive-additional-option/:id',
            method: ctrls.property_option_ctrl.activeInactive,
            type: 'PUT'
        },
        {
            url: '/update-additional-option/:id',
            method: ctrls.property_option_ctrl.update,
            type: 'PUT'
        },
        {
            url: '/delete-additional-option/:id/:type',
            method: ctrls.property_option_ctrl.delete,
            type: 'DELETE'
        },
        /*end*/

        /*franchisee management routes*/
        {
            url: '/franchisee-request-list',
            method: ctrls.franchisee_request_management_ctrl.requestList,
            type: 'GET'
        },
        {
            url: '/get-franchisee-request-detail',
            method: ctrls.franchisee_request_management_ctrl.getRequestDetail,
            type: 'GET'
        },
        {
            url: '/search-framchisee-request',
            method: ctrls.franchisee_request_management_ctrl.search,
            type: 'GET'
        },
        {
            url: '/delete-franchisee-request/:id',
            method: ctrls.franchisee_request_management_ctrl.delete,
            type: 'DELETE'
        },
        {
            url: '/franchisee-list',
            method: ctrls.franchisee_request_management_ctrl.franchiseeList,
            type: 'GET'
        },
        {
            url: '/search-franchisee-by-post-code',
            method: ctrls.franchisee_request_management_ctrl.searchFranchisee,
            type: 'GET'
        },        
        {
            url: '/update-franchisee-request',
            method: ctrls.franchisee_request_management_ctrl.updateFranchiseeRequest,
            type: 'POST'
        },
        /*end*/

        /*professional traders routes*/
        {
            url: '/professional-traders-request',
            method: ctrls.professional_traders_management_ctrl.serviceRequestList,
            type: 'GET'
        },
        /*end*/

    ]
};