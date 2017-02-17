'use strict';

const path = require('path'),
    testimonialModel = require(path.resolve('./models/testimonial_model'));

exports.insertUpdateTestimonail = (req, res) => {
    var obj  = req.body.detail;
    if (req.files.length > 0) {
        let image = req.files[0].path;
        obj.image = image.substring(image.indexOf("/")+1);
    }   

    if (obj._id) {
        testimonialModel.update({
            _id: obj._id
        }, obj, function(err, result) {
            if (result.nModified == 1) {
                res.json({
                    success: true,
                    msg: "Updated successfully"
                });
            } else {
                res.json({
                    success: false,
                    msg: " Some errors occurred"
                });
            }
        });
    } else {
        var testimonial = new testimonialModel(obj);
        testimonial.save(function(err, result) {
            console.log(result);
            if (result) {
                res.json({
                    success: true,
                    msg: "Added successfully"
                });
            } else {
                res.json({
                    success: false,
                    msg: " Some errors occurred"
                });
            }
        });
    }
};

exports.testimonialData = (req, res) => {
    testimonialModel.find({
        type: {
            $ne: 'cat'
        }
    }, {
        name: 1,
        assigned_category: 1,
        status: 1,
        sort: 1,
        image:1
    }, function(err, result) {
        if (err || result.length < 1) {
            res.json({
                success: true,
                data: []
            });
        } else {
            res.json({
                success: true,
                data: result
            });
        }
    });
};

exports.addTestimonialCategory = (req, res) => {
    testimonialModel.update({
        type: 'cat'
    }, {
        $push: {
            category: req.body.category
        }
    }, { upsert: true }, (err, result)=> {
        if (result.n == 1) {
            res.json({
                success: true,
                msg: "Category added successfully"
            });
        } else {
            res.json({
                success: false,
                msg: "Some errors occurred"
            });
        }
    });
};

exports.testimonialCategory = (req, res) => {
    testimonialModel.find({
        type: 'cat'
    }, {
        category: 1,
        _id: 0
    }, function(err, result) {
        res.json({
            success: true,
            cat: result
        });
    });
};