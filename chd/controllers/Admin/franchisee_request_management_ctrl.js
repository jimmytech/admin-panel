'use strict';

const path = require('path'),
    crypto = require('crypto'),
    async = require('async'),
    user                    = require(path.resolve('./models/User')),
    request_management = require(path.resolve('./models/request')),
    config = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));

exports.requestList = (req, res, next) => {
    request_management.find({
        "type": "franchise"
    }, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({
                success: true,
                record: result
            });
        }
    });
};


exports.getRequestDetail = (req, res, next) => {
    request_management.findById(req.query.id, {
        updated: 0,
        type: 0,
        __v: 0
    }, (err, result) => {
        if (err) {
            res.status(201).json({
                success: false
            });
        } else {
            res.status(201).json({
                success: true,
                record: result
            });
        }
    });
};

exports.delete = (req, res) => {
    request_management.remove({
        "_id": req.params.id
    }, (err, result) => {
        if (result.result.n == '1') {
            res.status(200).json({
                success: true,
                msg: 'Removed successfully',
            });
        } else {
            res.status(400).json({
                success: false,
                msg: 'Try again.'
            });
        }
    });
};

exports.search = (req, res, next) => {
    let search = req.query.search;
    request_management.find({
        $or: [{
            firstname: {
                $regex: search,
                $options: 'i'
            }
        }, {
            lastname: {
                $regex: search,
                $options: 'i'
            }
        }, {
            email: {
                $regex: search,
                $options: 'i'
            }
        }]
    }, (err, result) => {
        if (err) {
            res.status(400).json({
                success: false
            });
        } else {
            res.status(200).json({
                success: true,
                record: result
            });
        }
    });
};

exports.franchiseeList = (req, res) => {
    user.aggregate(
        [{
            $match: {
                role: "franchisee"
            }
        }, {
            $project: {
                phone: 1,
                firstname: 1,
                lastname: 1,
                email: 1,
                intrested_zip: 1,
                status: 1,
                deactivate: 1
            }
        }, {
            $unwind: "$intrested_zip"
        }, {
            $sort: {
                intrested_zip: 1
            }
        }, ], (err, result) => {
            if (result) {
                res.status(200).json({
                    success: true,
                    record: result
                });
            } else {
                res.status(200).json({
                    success: false,
                    record: []
                });
            }
        });
};

exports.searchFranchisee = (req, res) => {
    let postcode = req.query.postcode;
    user.aggregate(
        [{
            $match: {
                role: "franchisee",
            }
        }, {
            $project: {
                phone: 1,
                firstname: 1,
                lastname: 1,
                email: 1,
                intrested_zip: 1,
                status: 1,
                deactivate: 1
            }
        }, {
            $unwind: "$intrested_zip"
        }, {
            $match: {
                intrested_zip: {
                        $regex: postcode,
                        $options: 'i'
                }
            }
        }, {
            $sort: {
                intrested_zip: 1
            }
        }], (err, result) => {
            if (result) {
                res.status(200).json({
                    success: true,
                    record: result
                });
            } else {
                res.status(200).json({
                    success: false,
                    record: []
                });
            }
        });
};

exports.updateFranchiseeRequest = (req, res) => {
   request_management.findOneAndUpdate({
        "_id": req.body._id
   }, req.body, (err, result)=>{
        if (result) {
            res.status(200).json({
                success: true,
                msg: 'Saved successfully',
            });
        } else {
            res.status(400).json({
                success: false,
                msg: 'Try again.'
            });
        }
   });
};
// setTimeout(function(){
//  var i;
//  for (i=0;i<10;i++) {
//  let unique = crypto.randomBytes(5).toString('hex');
//  let obj = {
//      type: 'franchise',
//      firstname: 'jitendra' +unique,
//      lastname: 'kumar rajput',
//      email: 'abc'+unique+'@gmail.com',
//      location: 'New delhi'+unique,
//      address: 'A-367, new ashok nagar'+unique,
//      phone: {telephone:'7042752172'},
//      // intrested_zip: ['sd4d', 'DFDSF2424', 'SDFSDF244SDF', 'SDFDS5', 'SDFSDF2', 'WRWER3454'],
//      intrested_zip: ['12dfgdf3','456tt','345354354', 'da345345','44dsddf4d','12dfg3','45dfgdf6','34ddfg534', 'dasfsf','44dd4d','12;;[3','4;l;[56','345gfdsg34', 'dhasfsf','44dhgsd4d','1233422fdgfdg','45cbvcvb6','34cvbcvb534', 'dasfsfdggg53s4f','sd4d'],
//      company: 'Google'+unique,
//      notes: "If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source.If you encounter this error only with minified code, consider using ngStrictDi (see ngApp) to provoke the error with the non-minified source."
//  };
//  console.log(obj);
//  var data = new request_management(obj);
//  data.save((err, result)=>{
//      console.log(err||result);
//  });
//  }

// },1000);