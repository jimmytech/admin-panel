'use strict';
const path = require('path'),
    SubscriptionPlan = require(path.resolve('./models/SubscriptionPlan')),
    crypto = require('crypto'),
    logger = require(path.resolve('./config/lib/logger'));
/*Add new service to make a plan. if there is no service in database you can 
not make any plan*/
exports.addService = (req, res) => {
    let body = req.body;
    let searvice = getName(body);
    SubscriptionPlan.update({
        type: "service"
    }, {
        $push: {
            services: {
                $each: searvice
            }
        }
    }, {
        "upsert": true
    }, function(err, result) {
        if (result.nModified == 1 || result.upserted) {
            res.json({
                success: true,
            });
        } else {
            res.json({
                success: false
            });
        }
    });
};
/*add new additional service its like addons*/
exports.addAdditionalService = (req, res) => {
    let body = req.body;
    let numericPrice = parseInt(body.price);
    body.price = numericPrice;
    SubscriptionPlan.update({
        type: "additionalService"
    }, {
        $push: {
            additional_services: body
        }
    }, {
        "upsert": true
    }, function(err, result) {
        if (result.nModified == 1 || result.upserted) {
            res.json({
                success: true,
            });
        } else {
            res.json({
                success: false
            });
        }
    });
};
/*this is function to get only service name from array of object */
var getName = function(req) {
    let searviceArray = [];
    let i;
    for (i = 0; i < req.length; i++) {
        searviceArray.push({
            name: req[i]
        });
    }
    return searviceArray;
};
/*add new plan by using services, name, description*/
exports.addSubscriptionPlan = (req, res) => {
    let body = req.body;
    body.type = 'plan';
    var data = new SubscriptionPlan(body);
    data.save(function(err, result) {
        if (body.name == result.name) {
            res.json({
                success: true,
            });
        } else {
            res.json({
                success: false
            });
        }
    });
};
/*update existing plan*/
exports.updateSubscriptionPlan = (req, res) => {
    var body = req.body;
    SubscriptionPlan.update({
        _id: body._id
    }, body, function(err, result) {
        if (result.nModified == 1) {
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
/*Search user by firstname | email and plan, services and additional services listing  */
exports.planAndServiceListing = (req, res) => {
    let requestFor = req.query.type;
    let optionArray = [{
        plan: {
            having_service: 1,
            price:1
        },
        service: {
            services: 1
        },
        additionalService: {
            additional_services: 1
        }
    }];
    let option = optionArray[0][requestFor];
    if (requestFor == 'plan') {
        option.name = 1;
        option.createdAt = 1;
        option.status = 1;
        option.type = 1;
        SubscriptionPlan.find({
            type: requestFor
        }, option, function(err, result) {
            if (result !== null) {
                res.json({
                    success: true,
                    data: result
                });
            } else {
                res.json({
                    success: false,
                    data: []
                });
            }
        });
    } else {
        SubscriptionPlan.findOne({
            type: requestFor
        }, option, function(err, result) {
            if (result !== null) {
                res.json({
                    success: true,
                    data: result
                });
            } else {
                res.json({
                    success: false,
                    data: []
                });
            }
        });
    }
};
/*manage status (enable or disable) of plans, services and additional services*/
exports.activeInactive = (req, res) => {
    let body = req.body;
    let mainId = body.mainId;
    let thisId = body.thisId;
    let changeTo = body.changeTo;
    let type = body.type;
    if (type == 'service') {
        SubscriptionPlan.update({
            '_id': mainId,
            'services._id': thisId
        }, {
            $set: {
                'services.$.status': changeTo
            }
        }, function(err, result) {
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
    } else if (type == 'additional-service') {
        SubscriptionPlan.update({
            '_id': mainId,
            'additional_services._id': thisId
        }, {
            $set: {
                'additional_services.$.status': changeTo
            }
        }, function(err, result) {
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
    } else if (type == 'plan') {
        console.log(req.body);
        SubscriptionPlan.update({
            _id: thisId
        }, {
            $set: {
                status: changeTo
            }
        }, function(err, result) {
            console.log(err || result);
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
    }
};
/*find service by its object ID*/
exports.serviceNameById = (req, res) => {
    SubscriptionPlan.findOne({
        type: 'service',
        'services._id': req.query.id
    }, {
        services: {
            $elemMatch: {
                _id: req.query.id
            }
        }
    }, {
        additional_services: false,
        having_service: false
    }, function(err, result) {
        if (result !== null) {
            res.json({
                success: true,
                data: result.services
            });
        } else {
            res.json({
                success: false,
                data: {}
            });
        }
    });
};
/*find additional service by its object id*/
exports.additionalServiceNameById = (req, res) => {
    SubscriptionPlan.findOne({
        type: 'additionalService',
        'additional_services._id': req.query.id
    }, {
        additional_services: {
            $elemMatch: {
                _id: req.query.id
            }
        }
    }, function(err, result) {
        if (result !== null) {
            res.json({
                success: true,
                data: result.additional_services
            });
        } else {
            res.json({
                success: false,
                data: {}
            });
        }
    });
};
/*get plan to perform edit operation*/
exports.planDetailToEdit = (req, res) => {
    console.log(req.query);
    let id = req.query.id;
    SubscriptionPlan.findById(id, {
        createdAt: 0,
        services: 0,
        additional_services: 0,
        updatedAt: 0
    }, function(err, result) {
        if (result !== null) {
            res.json({
                success: true,
                data: result
            });
        } else {
            res.json({
                success: false,
                data: {}
            });
        }
    });
};
/*update services by validating its object ID*/
exports.updateServices = (req, res) => {
    SubscriptionPlan.update({
        "type": 'service',
        'services._id': req.body._id
    }, {
        $set: {
            'services.$.name': req.body.name
        }
    }, (err, result)=> {
        if (result.nModified == 1) {
            SubscriptionPlan.update({
                   type: 'plan', 
                   having_service: req.body.previous.name
            }, 
            {
                $set: {
                    "having_service.$" : req.body.name
                }
            }, (error, plan)=>{
                console.log(error||plan);
            });
            res.json({
                success: true,
            });
        } else {
            res.json({
                success: false
            });
        }
    });
};

/*update additional services by validating its object ID and type*/
exports.updateAdditionalServices = (req, res) => {
    let body = req.body;
    let numericPrice = parseInt(body.price);
    body.price = numericPrice;
    SubscriptionPlan.update({
        type: 'additionalService',
        'additional_services._id': body._id
    }, {
        $set: {
            'additional_services.$': body
        }
    }, function(err, result) {
        console.log(err || result);
        if (result.nModified == 1) {
            res.json({
                success: true,
            });
        } else {
            res.json({
                success: false
            });
        }
    });
};