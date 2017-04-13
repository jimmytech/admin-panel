'use strict';

const path = require('path'),
    Property_additional = require(path.resolve('./models/Property_additional'));


exports.addNewType = (req, res, next) => {
    let body = req.body;
    let list = body.list;
    let type = body.type;
    let options = [];
    list.map((a) => {
        let temp = {
            name: a,
            option_type: req.body.option_type,
        };
        options.push(temp);
    });
    Property_additional.update({
        type: 'option'
    }, {
        $push: {
            [type]: {
                $each: options
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
                msg: 'Saved successfully'

            });
        } else {
            res.status(400).json({
                success: false,
                msg: 'Try again'
            });
        }
    });
};

exports.getData = (req, res, next) => {
    Property_additional.findOne({
        type: 'option'
    }, {
        additional_feature: 0,
        additional_exclusion: 0,
        __v: 0,
        _id: 0,
        type: 0,
        updated: 0,
        created: 0
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

exports.activeInactive = (req, res, next)=>{
    console.log(req.body);
    let body = req.body;
    let field = body.type+'._id';
    let destination = body.type+'.$.status';
    Property_additional.update({
        type: 'option',
        [field] : req.params.id
    }, 
    {
        $set: {
            [destination]: body.status
        }
    }, 
    (err, result)=>{
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

exports.getDataToedit = (req, res, next) => {
    let field = req.query.type+'._id';
    let projection = req.query.type+'.$._id';
    Property_additional.findOne({
        'type': 'option',
        [field]: req.query.id
    }, {
        [projection]: 1,
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
    console.log(req.body);
    console.log(req.params.id);
    let body = req.body;
    let _id = req.body.type+'._id';
    let name = req.body.type+'.$.name';
    let sale = req.body.type+'.$.option_type';
    Property_additional.update({
        type: 'option',
        [_id]: req.params.id
    }, {
        $set: {
            [name]: body.name,
            [sale]: body.option_type
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
    let field = req.params.type;
    Property_additional.update({type: 'option'},
    {
        $pull: { [field]: { _id: req.params.id}}
    }, (err, result)=>{
        console.log(err||result);        
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