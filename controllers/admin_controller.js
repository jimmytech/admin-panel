'use strict';

require('../models/user_model');
require('../models/cms_model');
require('../models/testimonial_model');
require('../models/faq_model');
require('../models/library_model');

const crypto            = require('crypto'),
    path                = require('path'),
    mongoose            = require('mongoose'),
    jwt                 = require('jsonwebtoken'),
    userModel           = mongoose.model('userModel'),
    cmsModel            = mongoose.model('cmsModel'),
    testimonialModel    = mongoose.model('testimonialModel'),
    faqModel            = mongoose.model('faqModel'),
    libraryModel        = mongoose.model('libraryModel'),
    key                 = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    blogStoryModel      = require(path.resolve('./models/story_blog_model'));


exports.login = (req, res) => {
    userModel.findOne({
        email: req.body.email,
        password: req.body.password,
        role: "admin"
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
            if (!user) {
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
    userModel.findOne({
        role: "admin"
    }, {
        firstname: 1,
        lastname: 1,
        email: 1,
        address:1,
        gander: 1
    }, function(err, result) {
        res.json({
            info: result
        });
    });
};

exports.updateProfile = (req, res) => {
    userModel.findOneAndUpdate({}, req.body, function(err, result) {
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







exports.deleteTestimonial = (req, res) => {
    testimonialModel.remove({
        _id: req.query.id
    }, function(err, result) {
        if (result.result.n == 1) {
            res.json({
                success: true,
                msg: "Deleted successfully"
            });
        } else {
            res.json({
                success: false,
                msg: "Some errors occurred"
            });
        }
    });
};

exports.testimonialDataToEdit = (req, res) => {
    testimonialModel.findOne({
        _id: req.query.id
    }, (err, result) => {
        if (result) {
            res.json({
                success: true,
                testimonial: result
            });
        } else {
            res.json({
                success: false,
                testimonial: []
            });
        }
    });
};






exports.insertUpdateFaq = (req, res) => {
    let obj = req.body;
    if (obj._id) {
        faqModel.update({
            _id: obj._id
        }, obj, function(err, result) {
            if (result.nModified == 1) {
                res.json({
                    success: true,
                    msg: "Updated successfully"
                });
            } else if (err) {
                if (err.code == 11000) {
                    res.json({
                        success: false,
                        msg: "Please try to use unique slug."
                    });
                }
            } else {
                res.json({
                    success: false,
                    msg: "Some errors occurred"
                });
            }
        });
    } else {
        let url = req.body.question.replace(/\s+/g, '-').replace(/([~!@#$%^&*"()_+=`{}\[\]\|\\:;'<>,.\/?/\ \ ])+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '').toLowerCase();
        let urlId = Date.now() + Math.floor((Math.random() * 10000) + 1);
        let slug = urlId + '/' + url;
        obj.slug = slug;
        let data = new faqModel(obj);
        data.save(function(err, result) {
            if (obj.question == result.question) {
                res.json({
                    success: true,
                    msg: "Added successfully"
                });
            } else {
                res.json({
                    success: false,
                    msg: "Some errors occurred"
                });
            }
        });
    }
};

exports.showFaqList = (req, res) => {
    faqModel.find({}, {
        question: 1,
        answer: 1,
        slug: 1,
        status: 1
    }, function(err, result) {
        if (result.length > 0) {
            res.json({
                success: true,
                faq: result
            });
        } else {
            res.json({
                success: false,
                faq: []
            });
        }
    });
};

exports.faqToedit = (req, res) => {
    faqModel.findOne({
        _id: req.query.id
    }, {
        created: 0
    }, function(err, result) {
        if (result) {
            res.json({
                success: true,
                faq: result
            });
        } else {
            res.json({
                success: false,
                faq: []
            });
        }
    });
};

exports.deleteFaq = (req, res) => {
    faqModel.remove({
        _id: req.query.id
    }, function(err, result) {
        if (result.result.n == '1') {
            res.json({
                success: true,
                msg: "Deleted successfully"
            });
        } else {
            res.json({
                success: false,
                msg: "Some errors occurred"
            });
        }
    });
};





exports.libraryFeatureList = (req, res) => {
    libraryModel.find({
        type: req.query.type
    }, {
        _id: 0,
        'library.lib': 1,
        'library._id': 1,
        'category.cat': 1,
        'category._id': 1,
        'label.lab': 1,
        'label._id': 1,
        'sub_category.sub': 1,
        'sub_category._id': 1
    }, function(err, result) {
        if (result.length > 0) {
            res.json({
                success: true,
                list: result
            });
        } else {
            res.json({
                success: false,
                list: []
            });
        }
    });
};
exports.addLibary = (req, res) => {
    var add = {
        _id: crypto.randomBytes(10).toString('hex'),
        lib: req.body.library,
        cat: []
    };
    libraryModel.update({
        type: 'lib'
    }, {
        $push: {
            library: add
        }
    }, function(err, result) {
        if (result.n == 1) {
            res.json({
                success: true,
                msg: "Library added successfully"
            });
        } else {
            res.json({
                success: false,
                msg: "Some errors occurred"
            });
        }
    });
};
exports.removeLibraryData = (req, res) => {
    libraryModel.update({}, {
            $pull: {
                sub_category: {
                    _id: req.query.id
                },
                label: {
                    _id: req.query.id
                },
                library: {
                    _id: req.query.id
                },
                category: {
                    _id: req.query.id
                }
            }
        }, {
            multi: true
        },
        function(err, result) {
            if (result.nModified == 1) {
                // if(req.query.type=="sub-category-list"){
                //      var removedSubCategory = req.query.find;
                // }
                res.json({
                    success: true,
                    msg: "Deleted successfully"
                });
            } else {
                res.json({
                    success: false,
                    msg: "Some errors occurred"
                });
            }
        });
};
exports.addLibaryCategory = (req, res) => {
    var add = {
        _id: crypto.randomBytes(10).toString('hex'),
        cat: req.body.category,
        subCat: []
    };
    libraryModel.update({
        type: 'cat'
    }, {
        $push: {
            category: add
        }
    }, function(err, result) {
        if (result.n == 1) {
            res.json({
                success: true,
                msg: "Library added successfully"
            });
        } else {
            res.json({
                success: false,
                msg: "Some errors occurred"
            });
        }
    });
};
exports.addLibaryLabel = (req, res) => {
    var add = {
        _id: crypto.randomBytes(10).toString('hex'),
        lab: req.body.label
    };
    libraryModel.update({
        type: 'libLabel'
    }, {
        $push: {
            label: add
        }
    }, function(err, result) {
        if (result.n == 1) {
            res.json({
                success: true,
                msg: "Label added successfully"
            });
        } else {
            res.json({
                success: false,
                msg: "Some errors occurred"
            });
        }
    });
};
exports.editAndSaveLibraryData = (req, res) => {
    if (req.query.type == 'ca') {
        libraryModel.update({
                'category._id': req.query.id
            }, {
                '$set': {
                    'category.$.cat': req.query.updated
                }
            },
            function(err, result) {
                if (result.nModified == 1) {
                    res.json({
                        success: true,
                        msg: "Updated successfully"
                    });
                } else {
                    res.json({
                        success: false,
                        msg: "Some errors occurred"
                    });
                }
            }
        );
    } else if (req.query.type == 'li') {
        libraryModel.update({
                'library._id': req.query.id
            }, {
                '$set': {
                    'library.$.lib': req.query.updated
                }
            },
            function(err, result) {
                if (result.nModified == 1) {
                    res.json({
                        success: true,
                        msg: "Updated successfully"
                    });
                } else {
                    res.json({
                        success: false,
                        msg: "Some errors occurred"
                    });
                }
            }
        );
    } else if (req.query.type == 'la') {
        libraryModel.update({
                'label._id': req.query.id
            }, {
                '$set': {
                    'label.$.lab': req.query.updated
                }
            },
            function(err, result) {
                if (result.nModified == 1) {
                    res.json({
                        success: true,
                        msg: "Updated successfully"
                    });
                } else {
                    res.json({
                        success: false,
                        msg: "Some errors occurred"
                    });
                }
            }
        );
    } else if (req.query.type == 'su') {
        libraryModel.update({
                'sub_category._id': req.query.id
            }, {
                '$set': {
                    'sub_category.$.sub': req.query.updated
                }
            },
            function(err, result) {
                if (result.nModified == 1) {
                    res.json({
                        success: true,
                        msg: "Updated successfully"
                    });
                } else {
                    res.json({
                        success: false,
                        msg: "Some errors occurred"
                    });
                }
            }
        );
    }
};
exports.viewSubCategory = (req, res) => {
    libraryModel.find({
        "type": "cat",
        "category._id": req.query.id
    }, {
        'category.$.subCat': 1,
    }, function(err, result) {
        if (!err) {
            res.json({
                success: true,
                data: result[0].category[0].subCat
            });
        } else {
            res.json({
                success: false,
                data: []
            });
        }
    });
};

exports.assignSubCategory = (req, res) => {
    var subCat = req.body.subCat;
    var i;
    var count = [];
    // for (i = 0; i < subCat.length; i++) {
    //     libraryModel.update({
    //             'category._id': req.body.catId
    //         }, {
    //             $push: {
    //                 "category.$.subCat": subCat[i]
    //             }
    //         },
    //         function(err, result) {
    //             count.push(result.nModified);
    //             if (count.length == subCat.length) {
    //                 res.json({
    //                     success: true,
    //                     msg: "Added successfully"
    //                 });
    //             } else if (err || result.nModified != 1) {
    //                 res.json({
    //                     success: false,
    //                     msg: "Some errors occurred"
    //                 });
    //                 return;
    //             }
    //         }
    //     );
    // }
};

exports.addSubCategory = (req, res) => {
    var add = {
        _id: crypto.randomBytes(10).toString('hex'),
        sub: req.body.subCategory
    };
    libraryModel.update({
        type: 'subCat'
    }, {
        $push: {
            sub_category: add
        }
    }, function(err, result) {
        if (result.n == 1) {
            res.json({
                success: true,
                msg: "Sub Category added successfully"
            });
        } else {
            res.json({
                success: false,
                msg: "Some errors occurred"
            });
        }
    });
};
exports.getLibDropDownList = (req, res) => {
    libraryModel.find({
        type: "cat"
    }, function(err, result) {
        console.log(err || result);
    });
};
exports.libraryRecords = (req, res, next) => {
    libraryModel.find({
        type: "cat"
    }, {
        name: 1,
        sort: 1,
        status: 1,
        type: 1
    }, function(err, result) {
        if (err) {
            return next(err);
        }
        if (result.length > 0) {
            res.json({
                success: true,
                data: result
            });
        } else {
            res.json({
                success: false,
                data: result
            });
        }
    });
};
exports.librarySubCatRecord = (req, res, next) => {
    libraryModel.find({
        type: "subCat",
        cat_id: req.query.id
    }, {
        name: 1,
        sort: 1,
        status: 1,
        type: 1
    }, function(err, result) {
        if (err) {
            return next(err);
        }
        if (result.length > 0) {
            res.json({
                success: true,
                data: result
            });
        } else {
            res.json({
                success: false,
                data: result
            });
        }
    });
};
exports.libraryPostsRecord = (req, res, next) => {
    libraryModel.find({
        type: "post",
        sub_cat_id: req.query.id
    }, {
        name: 1,
        sort: 1,
        status: 1,
        type: 1
    }, function(err, result) {
        if (err) {
            return next(err);
        }
        if (result.length > 0) {
            res.json({
                success: true,
                data: result
            });
        } else {
            res.json({
                success: false,
                data: result
            });
        }
    });
};
exports.addUpdateLibCat = (req, res) => {
    var obj = req.body;
    var data = new libraryModel(obj);
    data.save(function(err, result) {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                msg: "Some errors occurred"
            });
            return;
        }
        if (result.name == req.body.name) {
            res.json({
                success: true,
                msg: "Added successfully"
            });
        } else {
            res.json({
                success: false,
                msg: "Some errors occurred"
            });
        }
    });
};
exports.updateLibRecord = (req, res) => {
    libraryModel.update({
        _id: req.body
    }, req.body, function(err, result) {
        console.log(err || result);
        if (err) {
            console.log(err);
            res.json({
                success: false,
                msg: "Some errors occurred"
            });
            return;
        }
        if (result.nModified == 1) {
            res.json({
                success: true,
                msg: "Updated successfully"
            });
        } else {
            res.json({
                success: false,
                msg: "You need to update information to submit your request"
            });
        }
    });
};
exports.receiveLibDataToEdit = (req, res) => {
    libraryModel.find({
        _id: req.query.id
    }, function(err, result) {
        if (err) {
            return ;
        }
        if (result.length > 0) {
            res.json({
                success: true,
                data: result
            });
        } else {
            res.json({
                success: false,
                data: result
            });
        }
    });
};

exports.deleteLibRecord = (req, res, next)=>{
    libraryModel.remove({$or:[ {'_id':req.query.id}, {'cat_id':req.query.id}, {'sub_cat_id':req.query.id}]}, function(err, result){
        if (err) {
            return next(err);
        }
        if (result.n > 0) {
            res.json({
                success: true,
                msg: "Deleted successfully"
            });
        } else {
            res.json({
                success: false,
                "msg": "Some errors occurred"
            });
        }        
    });
};


exports.changePassword = (req, res)=>{            
    userModel.findOneAndUpdate({}, req.body, function(err, result){

    if(result){
        res.json({
            success: true,
            msg: "Password Changed successfully"
        })        ;
    }else{
        res.json({
            success: false,
            msg: "Some errors occurred"
        })        ;
    }
    });
};










// setTimeout(function(){
//    var i;
//     var tel = {
//         telephone:"7042752172"
//     }
//  for(i=0; i<1;i++){      
//    var obj = {
//      firstname: 'Jitendra',
//      lastname : 'admin',            
//      email: 'admin'+i+'@admin.com',
//      password: '123456',
//      role: 'admin',   
//         auth:crypto.randomBytes(10).toString('hex')    
//    };
//    console.log(obj);
//    var data = new userModel(obj);
//    data.save(function(err, result){
//      console.log(err||result)
//    })
//  }
// });