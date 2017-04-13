'use strict';

const path = require('path'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    _ = require('lodash'),
    async = require('async'),
    mail = require(path.resolve('./config/lib/mail')),
    paginate = require(path.resolve('./config/lib/paginate')),
    config = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    User = require(path.resolve('./models/User')),
    Property = require(path.resolve('./models/Property')),
    mongoose = require('mongoose'),
    ObjectId = require('mongodb').ObjectID,
    Queue = require(path.resolve('./models/CronQueue'));

chai.use(chaiHttp);


exports.saveAlertsRecords = (req, res) => {

    async.waterfall([

        /*fetch user record from user collection*/
        function(done) {

            let frequencyType = ['daily', 'weekly', 'monthly', 'immediately'];
            let selectfrequencyType = frequencyType[Math.floor(Math.random() * frequencyType.length)];

            User.aggregate([{
                    $project: {
                        save_searches: 1,
                        deactivate: 1,
                        status: 1,
                        email: 1
                    }
                },
                {
                    $match: {
                        save_searches: {
                            $ne: []
                        },
                        deactivate: false,
                        status: true
                    }
                },
                {
                    $unwind: "$save_searches"
                },
                {
                    $match: {
                        "save_searches.frequency": selectfrequencyType
                    }
                },
                {
                    $project: {
                        "save_searches.frequency": 1,
                        "save_searches.filters": 1,
                        "save_searches.name": 1,
                        email: 1
                    }
                }
            ], (err, totalResult) => {

                done(err, totalResult);

            });
        },

        /*check if record is already exists in Queue collection*/
        function(totalResult, done) {

            let data = [];

            async.each(totalResult, (result, callback) => {
                let temp = encodeURI(`${result._id}${result.save_searches.name}`);
                Queue.findOne({
                    "exclusive_key": temp
                }, (exclusiveEroor, exclusiveResult) => {

                    if (exclusiveResult === null) {
                        data.push(result);
                    }
                    callback(exclusiveEroor);

                });
            }, (err) => {

                done(err, data);

            });
        },

        /*check if save search match with saved properties*/
        function(result, done) {

            let data = [];

            async.each(result, (value, callback) => {
                console.log(value);

                chai.request(`${config.server.host}:${config.server.PORT}`)
                    .post('/search')
                    .send(_.merge(value.save_searches.filters))
                    .end((err, searchResult) => {

                        if (searchResult.body.data.records.length > 0) {

                            let exclusiveKey = `${value._id}${value.save_searches.name}`;
                            let propertyId = searchResult.body.data.records.map((obj) => {
                                return mongoose.Types.ObjectId(obj._id);
                            });
                            let obj = {
                                'property': propertyId,
                                'email': value.email,
                                'frequency': value.save_searches.frequency,
                                'user': mongoose.Types.ObjectId(value._id),
                                'exclusive_key': encodeURI(exclusiveKey)
                            };

                            data.push(obj);

                        }

                        callback(err);
                    });
            }, (err) => {

                done(err, data);

            });
        },

        /*save record into Queue collection */
        function(data, done) {

            if (data.length > 0) {

                Queue.collection.insertMany(data, {
                    ordered: false
                }, (err, success) => {
                    done(err, 'success');
                });

            }
        }

    ], (err, result) => {
        // console.log(result);			
    });
};

exports.getImmediatelySearchAlerts = (req, res, next) => {

    // Queue.aggregate([{
    //     $match: {
    //         "frequency": req.query.type
    //     }
    // }, {
    //     $project: {
    //         "exclusive_key": 0,
    //         "frequency": 0
    //     }
    // }, {
    //     $limit: config.emailLimit
    // }, {
    //     $unwind: "$property"
    // }, {
    //     $lookup: {
    //         from: "properties",
    //         localField: "property",
    //         foreignField: "_id",
    //         as: "propertyDocs"
    //     }
    // }, {
    //     $unwind: "$propertyDocs"
    // }, {
    //     $group: {
    //         _id: {
    //             id: "$_id",
    //             email: "$email"
    //         },
    //         properties: {
    //             $push: "$propertyDocs"
    //         }
    //     }
    // }], (err, result) => {
    //     if (result.length > 0) {

    //         // result.map((obj) => {
    //         //     mail.send({
    //         //         subject: 'Property Alert',
    //         //         html: './public/mail/user/save-property-alert.html',
    //         //         from: config.mail.from,
    //         //         to: obj._id.email,
    //         //         emailData: {
    //         //             propertyData: obj.properties
    //         //         }
    //         //     }, function(err, success) {
    //         //         console.log(err || success);
    //         //     });
    //         // });

    //     }
    // });

};

// setTimeout(()=>{

// setInterval(() => {

    // chai.request(`${config.server.host}:${config.server.PORT}`)
    // .get('/save_alert_records')
    // .end((err, result)=>{
    // });

    // chai.request(`${config.server.host}:${config.server.PORT}`)
    // .get('/get_immediately_search_alerts')
    // .end((err, result)=>{
    // });

// }, 2000);