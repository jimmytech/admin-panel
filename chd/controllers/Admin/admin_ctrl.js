'use strict';
const path = require('path'),
    User = require(path.resolve('./models/User')),
    Admin = require(path.resolve('./models/Admin')),
    request_management = require(path.resolve('./models/request')),
    jwt = require('jsonwebtoken'),
    crypto = require('crypto'),
    async = require('async'),
    logger = require(path.resolve('./config/lib/logger')),
    mail = require(path.resolve('./config/lib/mail')),
    appCtrl = require(path.resolve('./controllers/User/indexCtrl')),
    config = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));

/*Admin login*/
exports.login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.json({
            error: {
                message: 'Email and password are required',
                name: 'Authentication failed',
                success: false,
            }
        });
        return;
    }
    Admin.findOne({
            email: req.body.email,
            role: 'superAdmin'
        }, {
            firstname: 1,
            lastname: 1,
            email: 1,
            password: 1,
            address: 1,
            phone: 1,
            auth: 1,
            created: 1
        },
        (err, user) => {
            if (err) {
                res.send(err);
            } else {
                if (!user) {
                    res.json({
                        error: {
                            name: 'Authentication failed',
                            message: 'Authentication failed. User not found.',
                            success: false,
                        }
                    });
                } else {
                    if (user.comparePassword(config.salt, req.body.password)) {
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
                        let token = jwt.sign(user, new Buffer(config.secret).toString('base64'));
                        res.json({
                            user: user,
                            token: token,
                            key: modifiedAuth,
                            success: true,
                            message: 'login success'
                        });
                    } else {
                        res.json({
                            error: {
                                name: 'Authentication failed',
                                message: 'Authentication failed. Wrong password.',
                                success: false,
                            }
                        });
                    }
                }
            }
        });
};

/*
 * Admin regsitration 
 */
exports.register = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        res.json({
            error: {
                message: 'Email, password and role are required',
                name: 'Registration failed',
                success: false,
            }
        });
        return;
    }
    let user = new User({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        auth: crypto.randomBytes(10).toString('hex')
    });
    user.save((err, user) => {
        if (err) {
            next(err);
        } else {
            res.json({
                message: 'Admin registered successfully',
                user: user,
                success: true
            });
        }
    });
};

/*Update admin profile*/
exports.updateMyProfile = (req, res) => {
    let body = req.body;
    let key = body.key;
    let modifiedkey = key.slice(0, 9) + key.slice(14, 25);
    delete body.key;
    async.waterfall([
        (callback) => {
            Admin.findOne({
                "auth": modifiedkey
            }, (err, result) => {
                callback(err, result);
            });
        },
        (doc, callback) => {
            Admin.update({
                "auth": modifiedkey
            }, body, {
                upsert: true
            }, (err, result) => {
                let status = result.nModified;
                callback(err, status, doc);
            });
        },
        (update, doc, callback) => {
            if (update == '1') {
                mail.send({
                    subject: 'Cherrydoor: Profile Update',
                    html: './public/mail/admin/email_updated.html',
                    from: config.mail.from,
                    to: doc.email,
                    emailData: {
                        firstname: doc.firstname || 'User'
                    }
                }, (err, success) => {
                    callback(err, success, doc);
                });
            }
        }
    ], (err, success, doc) => {
        if (success.message == 'success') {
            res.json({
                success: true,
                data: req.body,
                key: key
            });
        } else {
            Admin.update({
                "auth": modifiedkey
            }, doc, {
                upsert: true
            }, (err, result) => {
                res.json({
                    success: false
                });
            });
        }
    });
};
/*Update admin password*/
exports.changeMyPassword = (req, res) => {
    let user = new Admin();
    let hashedPassword = user.hashPassword(config.salt, req.body.current);
    Admin.findOne({
        $and: [{
            role: req.body.role
        }, {
            password: hashedPassword
        }]
    }, function(err, result) {
        if (result === null) {
            res.json({
                msg: 'Current password did not match.',
                success: false
            });
        } else {
            result.password = req.body.confirm;
            result.save(function(error, update) {
                if (update.role == 'superAdmin') {
                    res.json({
                        msg: 'Your password has been changed',
                        success: true
                    });
                }
            });
        }
    });
};

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = (req, res, next) => {
    if (!req.body || !req.body.email) {
        res.json({
            error: {
                message: 'Email field is required',
                success: false,
            }
        });
        return;
    }
    Admin.findOne({
        email: req.body.email
    }, {
        _id: 1,
        username: 1
    }, function(err, user) {
        if (err || !user) {
            res.status(400).json({
                error: {
                    message: 'No account with that email has been found',
                    success: false,
                }
            });
        } else {
            crypto.randomBytes(20, function(err, buffer) {
                let token = buffer.toString('hex');
                let baseUrl = `${req.protocol}://${req.headers.host}`;
                mail.send({
                    subject: 'Admin Password Reset Email',
                    html: './public/mail/user/reset-password.html',
                    from: '"Flexsin Tech " <flexsin.php@gmail.com>',
                    to: 'yash_sharma@seologistics.com',
                    emailData: {
                        name: user.username || 'Admin',
                        url: `${baseUrl}/admin/reset/${token}`
                    }
                }, function(err, success) {
                    if (err) {
                        res.status(400).json({
                            error: {
                                source: err,
                                message: 'Failure sending email',
                                success: false
                            }
                        });
                    } else {
                        let reset_password = {
                            token: token,
                            timestamp: Date.now() + 3600000,
                            status: true
                        };
                        Admin.update({
                            _id: user._id
                        }, {
                            "reset_password": reset_password
                        }, function(err, nuser) {
                            if (err) {
                                next(err);
                            } else {
                                res.json({
                                    success: true,
                                    message: 'An email has been sent to the provided email with further instructions.'
                                });
                            }
                        });
                    }
                });
            });
        }
    });
};
/**
 * Reset password GET from email token
 */
exports.validateResetToken = (req, res, next) => {
    User.count({
        "reset_password.token": req.params.token,
        "reset_password.timestamp": {
            $gt: Date.now()
        },
        "reset_password.status": true
    }, function(err, user) {
        if (err || !user) {
            return res.redirect('/assets/admin/password/invalid.html');
        } else {
            res.redirect(`/assets/admin/password/reset/${req.params.token}`);
        }
    });
};
/*
 get user list
*/
exports.userList = (req, res, next) => {
    let key = req.query.key;
    let limit = config.userManagementLimit;
    let query = req.query.key == 'all-user' ? {
        role: {
            $ne: null
        }
    } : {
        role: config.userRoles[key]
    };
    let projection = {
        firstname: 1,
        lastname: 1,
        email: 1,
        status: 1,
        role: 1,
        deactivate: 1,
        created: 1,
        email_verified: 1
    };
    if (req.query.search) {
        let search = req.query.search;
        User.find({
            $and: [{
                    $or: [{
                        email: {
                            $regex: search,
                            $options: 'i'
                        }
                    }, {
                        firstname: {
                            $regex: search,
                            $options: 'i'
                        }
                    }]
                },
                query
            ]
        }, (err, result) => {
            if (result.length < 1) {
                res.json({
                    success: false,
                    searchBar: true,
                    list: []
                });
            } else {
                res.json({
                    success: true,
                    searchBar: true,
                    list: result
                });
            }
        });
    } else {
        let sort = req.query.sort === 'desc' ? -1 : 1;
        let paginate = req.query.paginate;
        let q = [{
            $match: query
        }, {
            $sort: {
                created: sort
            }
        }, {
            $skip: (paginate - 1) * limit
        }, {
            $limit: limit
        }, {
            $project: projection
        }];
        User.aggregate(q, (err, result) => {
            if (result.length < 1) {
                res.json({
                    success: false,
                    searchBar: false,
                    list: []
                });
            } else {
                User.count(query, (e, count) => {
                    let paging = {
                        'page': paginate,
                        'current': result.length, // currently showing results count
                        'count': count,
                        'prevPage': (paginate > 1),
                        'nextPage': (count > (paginate * limit)),
                        'limit': limit
                    };
                    res.json({
                        success: true,
                        searchBar: true,
                        list: result,
                        paging: paging
                    });
                });
            }
        });
    }
};


/*
Total user count to show in slidebar
*/
exports.userCount = (req, res) => {
    User.aggregate({
        $group: {
            _id: "$role",
            count: {
                $sum: 1
            }
        }
    }, (err, result) => {
        res.json({
            data: result
        });
    });
};
/*
Delete user from list
*/
exports.deleteUser = (req, res) => {
    let schema = req.query.role == 'subadmin' ? Admin : User;
    schema.remove({
        '_id': req.query.id
    }, (err, obj) => {
        if (obj.result.n == '1') {
            res.json({
                success: true
            });
        } else {
            res.json({
                success: false
            });
        }
    });
};
/*
Change user state to perform action
*/
exports.activeInactive = (req, res) => {
    let schema = req.query.role == 'subadmin' ? Admin : User;
    schema.update({
        "_id": req.query.id
    }, {
        "status": req.query.status
    }, (err, result) => {
        if (result.n == '1') {
            res.json({
                success: true
            });
        } else {
            res.json({
                success: false
            });
        }
    });
};

/*generate unique token*/
function userToken(t1, t2) {
    let t1PartOne = t1.slice(0, 9);
    let t1PartTwo = t1.slice(9, 20);
    let t2PartOne = t2.slice(0, 9);
    let t2PartTwo = t2.slice(9, 20);
    let token = `${t1PartOne}${t2PartTwo}${t1PartTwo}${t2PartOne}`;
    return token;
}

/*
create new account by admin
*/
exports.signupByAdmin = (req, res, next) => {
    let newAccount = req.body;
    let emailTemplate = newAccount.emailTemplate;
    let key1 = crypto.randomBytes(10).toString('hex');
    let key2 = crypto.randomBytes(10).toString('hex');
    let token = userToken(key1, key2);
    newAccount.password = key1;
    newAccount.auth = token;
    newAccount.status = true;
    newAccount.email_verified = true;
    if (newAccount._id) {   
            newAccount.address = newAccount.address;
            newAccount.phone = newAccount.phone;
            newAccount.role = 'franchisee';
            newAccount.check = newAccount._id;
            var keys = ["_id", "created", "notes"];
            keys.map(function(k){
                delete newAccount[k];
            });  
            if (!newAccount.intrested_zip || newAccount.intrested_zip.length===0) { 
                return res.json({
                    success: false,
                    msg: 'Please select postcode'
                });   
            }                       
    }
    let data = new User(newAccount);
    data.save((err, result) => {
        if (err) {
            var resErr;
            for (var error in err.errors) {
                resErr = err.errors[error];
            }
            res.json({
                success: false,
                msg: resErr.message
            });
        } else if (result.email == req.body.email) {
            notify(req, res, newAccount, emailTemplate);
        } else {
            res.json({
                success: false,
                msg: 'Try again!'
            });
        }
    });
};


/*notify to user and send confirmation email to genrate password*/
function notify(req, res, newAccount, emailTemplate) {
    let url = `${req.protocol}://${req.headers.host}/admin/generate-password/${newAccount.auth}`;
    mail.send({
        subject: 'Cherrydoor Registration',
        html: './public/mail/admin/dynamic_email.html',
        from: config.mail.from,
        to: newAccount.email,
        emailData: {
            firstname: emailTemplate,
        }
    }, (err, success) => {
        if (success.message == 'success') {
            if (newAccount.check) {
                request_management.remove({"_id": newAccount.check}, function(){
                });
            }
            res.json({
                success: true,
                msg: 'Account Created successfully.'
            });
        } else {
            res.json({
                success: false,
                msg: 'Try again!'
            });
        }
    });
}

exports.verifyGenratePasswordRequest = (req, res) => {
    User.findOne({
        auth: req.params.token
    }, function(err, result) {
        if (result === null) {
            res.json({
                msg: 'Invalid Url',
                success: false
            });
        } else {
            res.redirect('/admin.html#/generate-password/' + req.params.token);
        }
    });

};



/*validate token */
function verifyToken(t) {
    let partOne = t.slice(0, 9);
    let partTwo = t.slice(20, 31);
    let token = `${partOne}${partTwo}`;
    return token;
}

/**
 *  view specific user information 
 */
exports.viewUserDetail = (req, res) => {

    let schema = req.query.role == 'subadmin' ? Admin : User;
    schema.findOne({
        _id: req.query.id
    }, {
        firstname: 1,
        lastname: 1,
        email: 1,
        status: 1,
        role: 1,
        address: 1,
        phone: 1,
        other_info: 1,
        plan: 1
    }, function(err, result) {
        if (result) {
            res.json({
                success: true,
                data: result,
            });
        }
    });
};

/**
 *  update user detail
 */
exports.updateUser = (req, res, next) => {
    var obj = req.body;
    User.update({
        email: obj.email,
        _id: obj._id
    }, {
        $set: obj
    }, function(err, result) {
        if (err) {
            return next(err);
        } else if (result.nModified == '1' || (result.n == '1' && result.nModified == '0')) {
            res.json({
                success: true
            });
        } else {
            res.json({
                success: false
            });
        }
    });
};

/*
export users record to csv
*/
exports.exportDataToCsv = (req, res) => {
    User.aggregate(
        [{
            $match: {
                'role': req.query.role
            }
        }, {
            $skip: parseInt(req.query.from)
        }, {
            $limit: parseInt(req.query.to)
        }, {
            $project: {
                _id: 0,
                firstname: "$firstname",
                lastname: "$lastname",
                email: "$email",
                phone: "$phone.telephone",
                address: "$address.street_address"
            }
        }],
        function(err, result) {
            if (err) {
                res.json({
                    success: false,
                    list: result
                });
            } else {
                res.json({
                    success: true,
                    list: result
                });
            }
        });
};

/**
 * script to create users
 */
// setTimeout(function(){
//    var i;
//     var tel = {
//         telephone:"7042752172"
//     };
//  for(i=0; i<600;i++){
//     var add ={
//         street_address: "street_address street_address street_address street_address1" + i,
//          city: "city city city city1"+ i,
//          state: "state state state state1"+ i,
//          postcode: "110096"+ i
//     };            
//      var obj = {
//          // firstname: 'Jitendra',
//          // lastname : 'professionalTrader',            
//         // email: 'admin@cherrydoor.com',
//          email: 'professionalTrader'+i+'@professionalTrader.com',
//         // address: add,            
//         // plan:'A',
//          password: '123456',
//          role: 'professionalTrader',   
//         auth:crypto.randomBytes(10).toString('hex'),         
//          // street_address: "street_address street_address street_address street_address",
//          // phone: tel,
//          other_info: 'other_info other_info other_info other_info other_info',
//          i:i
//      };
//      var data = new User(obj);
//      data.save(function(err, result){
//          console.log(err||result);
//      });
//  }
// });

/**/

// setTimeout(function(){
//    var i;
//     var tel = {
//         telephone:"7042752172"
//     };
//  for(i=0; i<20;i++){
//     var add ={
//         street_address: "street_address street_address street_address street_address1" + i,
//         address1: 'address1address1address1address1address1address1'+i,
//          city: "city city city city1"+ i,
//          state: "state state state state1"+ i,
//          postcode: "110096"+ i
//     };            
//      var obj = {
//          firstname: 'Jitendra',
//          lastname : 'subadmin',            
//         // email: 'admin1@cherrydoor.com',
//          email: 'subadmin'+i+'@subadmin.com',
//         address: add,            
//          password: '123456',
//          role: 'subadmin',   
//          admin_type: 'website',
//          admin_access: 'poweruser',
//          auth:crypto.randomBytes(10).toString('hex'),         
//          phone: tel,
//          other_info: 'other_info other_info other_info other_info other_info',
//          i:i
//      };
//      var data = new Admin(obj);
//      data.save(function(err, result){
//          console.log(err||result);
//      });
//  }
// });