'use strict';

const path = require('path'),
    cmsModel = require(path.resolve('./models/cms_model'));

exports.insertUpdate = (req, res) => {
    let obj  = req.body.pageInfo;
    if (req.files.length > 0) {
        let image = req.files[0].path;
        obj.image = image.substring(image.indexOf("/")+1);
    } 
    if (obj._id) {
        cmsModel.findOneAndUpdate({
            _id: obj._id
        }, obj, function(err, result) {
            if (result) {
                res.json({
                    success: true,
                    msg: "Updated successfully"
                });
            } else {
                res.json({
                    success: false,
                    msg: 'Some errors occurred'
                });
            }
        });
    } else {
        let page = new cmsModel(obj);
        page.save(function(err, result) {
            if (err || result.title !== obj.title) {
                res.json({
                    success: false,
                    msg: 'Some errors occurred'
                });
            } else {
                res.json({
                    success: true,
                    msg: "Added successfully"
                });
            }
        });
    }
};

exports.showPagesList = (req, res) => {
    cmsModel.find({}, {
        title: 1,
        top: 1,
        bottom: 1,
        status: 1,
        sort: 1
    }, function(err, result) {
        if (err || result.length < 1) {
            res.json({
                success: true,
                pages: []
            });
        } else {
            res.json({
                success: true,
                pages: result
            });
        }
    });
};

exports.editpage = (req, res) => {
    cmsModel.findOne({
        _id: req.query.id
    }, (err, result) => {
        if (result) {
            res.json({
                success: true,
                page: result
            });
        } else {
            res.json({
                success: false,
                page: ""
            });
        }
    });
};

exports.deletePage = (req, res) => {
    cmsModel.remove({
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