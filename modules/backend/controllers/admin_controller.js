'use strict';


const crypto            = require('crypto'),
    path                = require('path'),
    mongoose            = require('mongoose'),
    jwt                 = require('jsonwebtoken'),
    async               = require('async'),
    adminModel          = require(path.resolve('./models/admin_model')),
    userModel           = require(path.resolve('./models/user_model')),
    blogModel           = require(path.resolve('./models/blog_model')),
    cmsModel            = require(path.resolve('./models/cms_model')),
    faqModel            = require(path.resolve('./models/faq_model')),
    categoryModel       = require(path.resolve('./models/category_model')),
    key                 = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


exports.login = (req, res) => {

    adminModel.findOne({
        email: req.body.email
    }, {
        firstname: 1,
        lastname: 1,
        email: 1,
        password: 1,
        address: 1,
        phone: 1,
        auth: 1,
        created: 1
    }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            if (!user || !user.matchPassword(req.body.password)) {
                res.json({
                    message: 'Authentication failed',
                    success: false
                });
            } else {

                let auth = user.auth;
                let miliseconds = JSON.stringify(+new Date(user.created));
                let firstAuth = auth.slice(0, 9);
                let secondAuth = auth.slice(9, 20);
                let firstMilisecond = miliseconds.slice(0, 5);
                let secondMilicond = miliseconds.slice(5, 7);
                let modifiedAuth = `${firstAuth}${firstMilisecond}${secondAuth}${secondMilicond}`;
                user.password = undefined;
                user.auth = undefined;
                user.created = undefined;
                let token = jwt.sign(user, new Buffer(key.secret).toString('base64'));
                res.json({
                    user: user,
                    token: token,
                    key: modifiedAuth,
                    success: true,
                    message: 'login success'
                });
            }
        }
    });
};

exports.profileInfo = (req, res) => {
    adminModel.findOne({
        email: "admin@admin.com"
    }, {
        firstname: 1,
        lastname: 1,
        email: 1,
        role:1,
        address: 1,
        gender: 1,
        user_name:1
    }, function(err, result) {

        res.json({
            info: result
        });
    });
};

exports.updateProfile = (req, res) => {
   
    adminModel.update({},
    {
        $set: req.body

    }, function(err, result) {

        if (result) {
            res.json({
                success: true,
                msg: "Profile updated successfully"
            });
        } else {
            res.json({
                success: false,
                msg: "some errors occurred "
            });
        }
    });
};

exports.changePassword = (req, res) => {

    if (req.body.password && req.body.currentPassword) {

        adminModel.findById(req.body._id, (err, user) => {

            if (user && user.matchPassword(req.body.currentPassword)) {

                adminModel.update({
                    "_id": req.body._id
                }, {
                    "$set" : {
                        "password": user.encryptPassword(req.body.password)
                    }
                }, (err, update) => {
                    
                    if (update) {

                        res.json({
                            success: true,
                            msg: "Password Changed successfully"
                        });   

                    }else{

                        res.json({
                            success: false,
                            msg: "Some errors occurred"
                        }); 

                    }
                });



            } else {

                res.json({
                    success: false,
                    msg: "Current password is invalid"
                });

            }
        });

    } else {

        res.json({
            success: false,
            msg: "Please provide password"
        });

    }
};

exports.getCount = (req, res) => {
    
        async.parallel({

            totalBlog: (cb) => {

                blogModel.count((err, count)=>{
                    cb(null, count);
                });

            },

            totalCategory: (cb) => {

                categoryModel.count((err, count) => {
                    cb(null, count);
                });

            },

            totalPages: (cb) => {

                cmsModel.count((err, count)=>{
                    cb(null, count);
                });

            },

            totalFaq: (cb) => {

                faqModel.count((err, count)=>{
                    cb(null, count);
                });

            }, 
            totalUser: (cb) => {

                userModel.aggregate([
                {
                    "$group": {
                        "_id": "$user_type",
                         "count": { "$sum": 1 } 
                    }
                }], (err, result) => {
                     cb(null, result);
                }); 

            }, 

        }, (err, result) => {

            res.json({
                result: result
            });

        }); 

};


