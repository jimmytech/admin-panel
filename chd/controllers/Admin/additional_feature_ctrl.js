'use strict';
const path = require('path'),
    Property_additional = require(path.resolve('./models/Property_additional')),
    crypto = require('crypto'),
    config = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


exports.additionalFeatureList = (req, res, next) => {
    Property_additional.findOne({
        type: 'additionalFeature'
    }, {
        additional_feature: 1,
        _id: 0
    }, (err, result) => {
        if (err) {
            return next(err);
        } else {
            res.status(200).json({
                success: true,
                record: result
            });
        }
    });
};

exports.addAdditionalFeature = (req, res, next) => {
    let list = req.body.list;
    let feature = [];
    list.map((a) => {
        let temp = {
            name: a
        };
        feature.push(temp);
    });
    console.log(feature);
    Property_additional.update({
        type: 'additionalFeature'
    }, {
        $push: {
            additional_feature: {
                $each: feature
            }
        }
    }, {
        upsert: true
    }, (err, result)=>{
        if (err) {
            return next(err);
        } else if (result.nModified == '1' || result.upserted.length > 0) {
            res.status(201).json({
                success: true,
                record: '',
                msg: 'Additional feature saved successfully'

            });
        } else {
            res.status(400).json({
                success: false,
                msg: 'Try again'
            });
        }
    });
};


exports.getAdditionalFeatureDetail = (req, res, next) => {
    Property_additional.findOne({
        'type': 'additionalFeature',
        'additional_feature._id': req.query.id
    }, {
        'additional_feature.$._id': 1,
        _id: 0,
    }, (err, result) => {
        if (err) {
            return next(err);
        } else if (result !== null) {
            res.status(201).json({
                success: true,
                record: result
            });
        } else {
            res.status(400).json({
                success: false,
                msg: 'Try again.'
            });
        }
    });
};

exports.update = (req, res, next) => {
    let body = req.body;
    Property_additional.update({
        'type': 'additionalFeature',
        'additional_feature._id': req.params.id
    }, {
        $set: {
            "additional_feature.$.name": body.name,
            "additional_feature.$.tooltip_text": body.tooltip_text
        }
    }, (err, result) => {
        console.log(err||result);
        if (err) {
            return next(err);
        } else if (result.nModified == '1') {
            res.status(200).json({
                success: true,
                msg: 'Updated successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                msg: 'Try again.'
            });
        }
    });
};

exports.activeInactive = (req, res, next)=>{
    let status = req.body.status === false? true : false;
    Property_additional.update({
        type: 'additionalFeature',
        'additional_feature._id': req.params.id
    }, {
        $set: {
            "additional_feature.$.status": status
        }
    }, (err, result) => {
        console.log(err||result);
        if (err) {
            return next(err);
        } else if (result.nModified == '1') {
            res.status(200).json({
                success: true,
                msg: 'Updated successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                msg: 'Try again.'
            });
        }
    });
};

exports.delete = (req, res, next)=>{    
    Property_additional.update({type: 'additionalFeature'},
    {
        $pull: { additional_feature: { _id: req.params.id}}
    }, (err, result)=>{
        if (err) {
            return next(err);
        } else if (result.nModified == '1') {
            res.status(200).json({
                success: true,
                msg: 'Deleted successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                msg: 'Try again.'
            });
        }
    });
};