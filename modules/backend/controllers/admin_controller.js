'use strict';


const crypto            = require('crypto'),
    path                = require('path'),
    mongoose            = require('mongoose'),
    jwt                 = require('jsonwebtoken'),
    async               = require('async'),
    decodeJwt           = require(path.resolve('./config/libs/verify_jwt')),
    msg                 = require(path.resolve('./config/libs/message')),
    adminModel          = require(path.resolve('./modules/backend/models/admin_model')),
    userModel           = require(path.resolve('./modules/frontend/models/user_model')),
    blogModel           = require(path.resolve('./modules/backend/models/blog_model')),
    cmsModel            = require(path.resolve('./modules/backend/models/cms_model')),
    faqModel            = require(path.resolve('./modules/backend/models/faq_model')),
    categoryModel       = require(path.resolve('./modules/backend/models/category_model')),
    serviceModel        = require(path.resolve('./modules/backend/models/service_model')),
    env                 = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


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

            if (!user || !user.matchPassword(req.body.pwd)) {

                res.json({
                    message: 'Authentication failed',
                    success: false
                });

            } else {

                user.password = undefined;
                user.auth = undefined;
                user.created = undefined;

                let token = jwt.sign(user, new Buffer(env.secret).toString('base64'));
                
                res.json({
                    user: user,
                    token: token,
                    success: true,
                    message: 'Logged in successfully'
                });

            }

        }
    });
};


exports.profileInfo = (req, res) => {

   let secret = env.secret;

   decodeJwt.run(req, secret, (data) => {

        adminModel.findOne({
            "_id": data._id
        }, {
            first_name: 1,
            last_name: 1,
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
        
   });


};

exports.updateProfile = (req, res) => {

   let secret = env.secret;

   decodeJwt.run(req, secret, (id) => {

        adminModel.update(
        {
            "_id": id
        },
        {
            $set: req.body

        }, function(err, result) {
            console.log(result);
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

                blogModel.count({"trash": false}, (err, count)=>{
                    cb(null, count);
                });

            },

            totalCategory: (cb) => {

                categoryModel.count({"trash": false}, (err, count) => {
                    cb(null, count);
                });

            },            

            totalService: (cb) => {

                serviceModel.count({"trash": false}, (err, count) => {
                    cb(null, count);
                });

            },

            totalPages: (cb) => {

                cmsModel.count({"trash": false},(err, count)=>{
                    cb(null, count);
                });

            },

            totalFaq: (cb) => {

                faqModel.count({"trash": false},(err, count)=>{
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


exports.getCountOnDashboard  = (req, res) => {
    console.log("hello getCountOnDashboard");

    async.parallel({

        user: (cb) => {
            userModel.count((err, count)=>{
                cb(null, count);
            });            
        },

        trashedUser: (cb) => {
            userModel.count({
                trash: true
            }, (err, count)=>{
                cb(null, count);
            });               
        }

    }, (err, result) => {

            res.json({
                data: result
            });

    });

};


exports.signUp = (req, res) => {

    req.body.password = "peache";
    let data = new userModel(req.body);

    data.save((err, result) => {
        if (result) {

            res.json({
                success: true,
                message: msg.signup
            });

        }else{

            res.json({
                success: false,
                message: msg.tryAgain
            });

        }        
    });
};

exports.trash = function(req, res){

    userModel.update({
        "_id": req.params.id
    }, {
        "$set": {
            "trash": true
        }
    }, (err, result)=>{
        if (result.nModified == 1) {
            res.json({
                success: true,
                msg: "Removed successfully"
            });
        } else if (err) {
            if (err.code == 11000) {
                res.json({
                    success: false,
                    msg: "Please try again"
                });
            }
        }
    });
};

exports.userInfo = (req, res) => {

    userModel.findOne({
        "_id": req.query.id
    }, (err, result) => {
        if (result) {
            res.json({
                result: result
            });
        }
    });
};


