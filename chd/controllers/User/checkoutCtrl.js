'use strict';
const path              = require('path'),
    config              = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    Property            = require(path.resolve('./models/Property')),
    Payment             = require(path.resolve('./models/Payment')),
    User                = require(path.resolve('./models/User')),
    subscriptionPlan    = require(path.resolve('./models/SubscriptionPlan')),
    logger              = require(path.resolve('./config/lib/logger')),
    mongoose            = require('mongoose'),
    response            = require(path.resolve('./config/lib/response'));


exports.additionalServiceList = (req, res, next) => {
    Property.findOne({
        "slug": req.params.slug
    }, {
        cart: 1,
        paid_services:1,
    }, (err, result) => {
        if (result) {
            res.json(response.success({
                success: true,
                record: result
            }));
        } else {
            next(err)
        }
    });
};

exports.paymentSuccessful = (req, res) => {

    // This is for debugging response later
    logger.log('info', req.body);

    let paymentInfo = req.body,
        custom = JSON.parse(paymentInfo.custom),
        itemArray = [],
        i;
    for (i = 1; i <= paymentInfo.num_cart_items; i++) {
        itemArray.push({
            "item": paymentInfo['item_name' + i],
            "mc_gross": paymentInfo['mc_gross_' + i]
        })
    }
    paymentInfo.item = itemArray;
    paymentInfo.email = custom.email;
    paymentInfo.property_id = custom.propertyId;
    let data = new Payment(paymentInfo);
    data.save((err, result) => {
        if (result) {
            if (paymentInfo.payment_status == "Completed") {
                cartToPaidservices(custom.propertyId);
            }else{
                // res.redirect('/#/transaction-failed');
            }
            //https://developer.paypal.com/docs/classic/ipn/integration-guide/IPNImplementation/
            res.status(200).end();
        }
    });
};

function cartToPaidservices(id) {
    Property.findOne({
        "_id": id
    }, {
        cart: 1,
        _id: 0
    }, (err, result) => {
        Property.update({
            "_id": id
        }, {
            $push: {
                paid_services: {
                    $each: result.cart
                }
            }
        }, (err, update) => {
            Property.update({
                "_id": id
            }, {
                $unset: {
                    cart: ""
                }, 
                $set: {
                    floor_plan_service: true
                }
            }, (err, unset) => {
                // res.redirect('/#/payment-successful');
            });
        });
    });
}