'use strict';
const path = require('path'),
    Property_additional = require(path.resolve('./models/Property_additional')),
    crypto = require('crypto'),
    config = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


exports.additionalExclusionList = (req, res, next) => {
    Property_additional.findOne({
        type: 'additionalExclusion'
    }, {
        additional_exclusion: 1,
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

exports.addAdditionalExclusion = (req, res, next) => {
    let list = req.body.list;
    let exclusion = [];
    list.map((a) => {
        let temp = {
            name: a,
            exclusion_type: req.body.exclusion_type
        };
        exclusion.push(temp);
    });
    Property_additional.update({
        type: 'additionalExclusion'
    }, {
        $push: {
            additional_exclusion: {
                $each: exclusion
            }
        }
    }, {
        upsert: true
    }, (err, result) => {
        if (err) {
            return next(err);
        } else if (result.nModified == '1' || result.upserted.length > 0) {
            res.status(201).json({
                success: true,
                record: '',
                msg: 'Additional exclusion saved successfully'

            });
        } else {
            res.status(400).json({
                success: false,
                msg: 'Try again'
            });
        }
    });   
};

exports.getAdditionalExclusionDetail = (req, res, next) => {
    Property_additional.findOne({
        'type': 'additionalExclusion',
        'additional_exclusion._id': req.query.id
    }, {
        'additional_exclusion.$._id': 1,
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
        type: 'additionalExclusion',
        'additional_exclusion._id': req.params.id
    }, {
        $set: {
            "additional_exclusion.$.name": body.text,
            "additional_exclusion.$.type": body.type
        }
    }, (err, result) => {
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
        type: 'additionalExclusion',
        'additional_exclusion._id': req.params.id
    }, {
        $set: {
            "additional_exclusion.$.status": status
        }
    }, (err, result) => {
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
    Property_additional.update({type: 'additionalExclusion'},
    {
        $pull: { additional_exclusion: { _id: req.params.id}}
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