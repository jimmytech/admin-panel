'use strict';
const path                  = require('path'),
    crypto                  = require('crypto'),
    mail                    = require(path.resolve('./config/lib/mail')),
    request_management      = require(path.resolve('./models/request')),
    user                    = require(path.resolve('./models/User')),
    response                = require(path.resolve('./config/lib/response')),
    config                  = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


exports.becomeFranchisee = (req, res, next) => {
    let requestInfo = req.body;
    let splited = requestInfo.intrested_zip.split(",").map(function(item){
                return item.trim();
            });
    splited = splited.filter((e) => {
        return e;
    });
    requestInfo.intrested_zip = splited;
    find(req, res, requestInfo, next);
};




/*check if user is already a franchisee*/
function find(req, res, requestInfo, next) {
    user.findOne({
        "role": "franchisee",
        "email": requestInfo.email
    }, (err, result) => {
        if (!result) {
            requestInfo.type = 'franchise';
            let data = new request_management(requestInfo);
            data.save((err, result) => {
                if (err) {                                         
                    res.status(400).json(
                        response.errors({
                            message: 'Sorry! You have already requested to become franchisee',
                            success: false
                        })
                    );
                } else{
                notify(req, res, requestInfo);
                res.json(
                    response.success({
                        message: 'Your request has been submited successfully',
                        success: true
                    })
                );
            }
            });
        } else {
            res.status(400).json(
                response.errors({
                    message: 'Sorry! You are already a franchise.',
                    success: false
                })
            );
        }
    });
}

/*notify to user and send confirmation email to genrate password*/

function notify(req, res, data) {
    let url = `${req.protocol}://${req.headers.host}`;
    mail.send({
        subject: 'Cherrydoor become franchise',
        html: './public/mail/admin/become_franchisee_request.html',
        from: config.mail.from,
        to: data.email,
        emailData: {
            firstname: data.firstname || 'User',
            email: data.email,
            link: url
        }
    }, function(err, emailResult){
        console.log(err||emailResult);
    });
}