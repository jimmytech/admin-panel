'use strict';

const path      = require('path'),
    _           = require('lodash'),
    mongoose    = require('mongoose'),
    config      = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    mail        = require(path.resolve('./config/lib/mail')),
    User        = require(path.resolve('./models/User')),
    response 	= require(path.resolve('./config/lib/response'));

/* Update user account */
exports.updateAccount = (req, res, next) => {
    // check if request has files
    let body;
    if( !_.isEmpty(req.files) ){
        let file = _.isArray(req.files) ? req.files[0] : req.files;
        let fileObj = {
            name: file.filename,
            path: config.profile_image_destination,
            original_name: file.originalname
        };
        body = { profile_image: fileObj };
    } else {
        body = req.body;
    }
    
    if (_.isEmpty(body)) {
        return res.json(
            response.errors({
                message: 'User details cannot be updated',
                success: false
            })    
        );
    }

    // Delete user email from request body to prevent update from this function
    delete req.body.email;
    User.findOneAndUpdate({_id: req.params.id }, body, 
        { new: true, runValidators: true, setDefaultsOnInsert: true, fields: {password: 0, intrested_zip: 0} }, 
        function(err, success) {
        if (err) {
            next(err);
        } else {
            res.json(
                response.success({
                    message: 'Contact details has updated successfully',
                    record: success,
                    success: true
                })    
            );
        }
    });
};
/* Change user password */
exports.changePassword = function(req, res, next) { 
    if (!req.body.new_password || !req.body.confirm_password) {
        return res.json(
            response.errors({
                message: 'New password and confirm password are required',
                name: 'Authentication failed',
                success: false
            })
        );
    }
    if (req.body.new_password !== req.body.confirm_password) {
        return res.json(
            response.errors({
                message: 'New password and confirm password are not same',
                name: 'Authentication failed',
                success: false
            })    
        );
    }
    let user = new User(),
    hashedPassword = user.hashPassword(config.salt, req.body.current_password);
    User.findOne({ $and: [{ '_id': req.params.id }, {'password': hashedPassword }] },
    (error, finaluser) => {
        if(finaluser){
            finaluser.password = req.body.new_password;
            finaluser.save(function(err, saveduser) {
                if (err) {
                    next(err);
                } else {

                    mail.send({
                        subject: 'Cherrydoor: Password changed',
                        html: './public/mail/user/password-updated.html',
                        from: config.mail.from,
                        to: saveduser.email,
                        emailData: {
                            firstname: saveduser.firstname || 'User'
                        }
                    }, function(err, success) {
                        if (err) {
                            res.json(
                                response.errors({
                                    source: err,
                                    message: 'Failure sending email',
                                    success: false
                                })    
                            );
                        } else {
                            res.json(
                                response.success({
                                    success: true,
                                    message: 'Your password has been changed'
                                })    
                            );
                        }
                    }); 
                }
            });
        } else {
            return res.json(
                response.errors({
                    name: 'Authentication failed',
                    message: 'Current password did not match.',
                    success: false
                })    
            );
        }
    });
};

/* Change user Email */

exports.updateEmail = function(req, res, next) {
    if( _.isEmpty(req.body.newemail) || _.isNull(req.body.newemail) ){
        return res.json(
            response.errors({
                message: 'Please provide new email address.',
                success: false
            })    
        );
    }
    var newEmail = req.body.newemail;
    var user = new User(),
    decodedPassword = user.hashPassword(config.salt, req.body.password);
    User.findOneAndUpdate({'_id': req.params.id, 'password': decodedPassword }, 
        { "email": newEmail }, 
        { new: false, runValidators: true, context: 'query', setDefaultsOnInsert: true, fields: {email: 1, _id: 0 } },
        function(err, user) {
            if (err) {
                return next(err);
            }
            if (user === null) {
                res.json(
                    response.errors({
                        name: 'Authentication failed',
                        message: 'You entered wrong Password.',
                        success: false
                    })    
                );
            } else {

                mail.send({
                    subject: 'Cherrydoor: Email address changed',
                    html: './public/mail/user/email-updated.html',
                    from: config.mail.from,
                    to: newEmail,
                    emailData: {
                        firstname: user.firstname || 'User',
                        oldemail: user.email,
                        newemail: newEmail
                    }
                }, function(err, success) {
                    if (err) {
                        res.json(
                            response.errors({
                                source: err,
                                message: 'Failure sending email',
                                success: false
                            })    
                        );
                    } else {
                        res.json(
                            response.success({
                                info: success,
                                message: 'Your email has been changed',
                                success: true
                            })    
                        );
                    }
                }); 
            }
        }
    );
};

/* Deactive User  */
exports.deactiveUser = function(req, res, next) {
    var user = new User(),
    hashedPassword = user.hashPassword(config.salt, req.body.password);
    
    User.findOneAndUpdate({'_id': req.params.id, 'password': hashedPassword }, 
        { "deactivate": true }, 
        { new: true, runValidators: true, setDefaultsOnInsert: true, fields: {email: 1, deactivate: 1, firstname: 1 } },
        function(err, updatedUser) {
            if(err){
                return next(err);
            }

            if(_.isNull(updatedUser)){
                return res.json(
                    response.errors({
                        name: 'Authentication failed',
                        message: 'You entered wrong Password.',
                        success: false
                    })    
                );
            }

            mail.send({
                subject: 'Deactive user account',
                html: './public/mail/user/deactive-user-confirm.html',
                from: config.mail.from,
                to: updatedUser.email,
                emailData: {
                    firstname: updatedUser.firstname
                }
            }, function(err, success) {
                if (err) {
                    res.json(
                        response.errors({
                            source: err,
                            message: 'Failure sending email',
                            success: false
                        })    
                    );
                } else {
                    res.json(
                        response.success({
                            success: true,
                            message: 'Your account has been deactivated'
                        })    
                    );
                }
            });
        }
    );
};

/* Remove user saved searches */
exports.delete_saved_search = function (req, res, next) {
    let userid = req.params.userid,
    save_search_id = req.params.id;
    User.update({_id: userid},
    { $pull: { save_searches:  { _id: save_search_id } } },
    function (err, result) {
        if(err){
            return next(err);
        }
        res.json(
            response.success({
                message: 'Saved search removed successfully',
                success: true
            })    
        );
    });
};

// Toggle searches & alerts
exports.toggleSearchAlert = function (req, res, next) {
    let userid = req.params.userid;
    if (_.isEmpty(req.body)) {
        return res.json(
            response.errors({
                message: 'No data in request body',
                success: false
            })    
        );
    }
    User.update({ _id: userid , 'save_searches._id': mongoose.Types.ObjectId(req.body._id) },
    { $set: { "save_searches.$.frequency": req.body.frequency } },
    { runValidators: true, setDefaultsOnInsert: true },
    function (err, result) {
        if(err){
            return next(err);
        }
        res.json(
            response.success({
                record: result,
                success: true,
                message: 'Alert updates successfully'
            })  
        );
    });
};