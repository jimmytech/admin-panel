'use strict';

const path					 = require('path'),
	 msg                     = require(path.resolve('./config/libs/message')),
	 faqModel                = require(path.resolve('./modules/backend/models/faq_model'));


exports.showFaqList = (req, res) => {

    faqModel.find({
    	trash: false
    }, {
        question: 1,
        status: 1
    }, (err, result) => {
        if (result.length > 0) {
            res.json({
                success: true,
                faq: result
            });
        } else {
            res.json({
                success: false,
            });
        }
    });
    
};

exports.insertUpdateFaq = (req, res) => {
    
    let obj = req.body;
    if (!obj._id) {
        let url = req.body.question.replace(/\s+/g, '-').replace(/([~!@#$%^&*"()_+=`{}\[\]\|\\:;'<>,.\/?/\ \ ])+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '').toLowerCase();
        let urlId = Date.now() + Math.floor((Math.random() * 10000) + 1);
        let slug = urlId + '/' + url;
        obj.slug = slug;
        let data = new faqModel(obj);
        data.save( (err, result) => {
            if (obj.question == result.question) {
                res.json({
                    success: true,
                    msg: "Added successfully"
                });
            } else {
                res.json({
                    success: false,
                    msg: "Some errors occurred"
                });
            }
        });

    } else {

        delete obj.created_at;
        delete obj.updated_at;

        faqModel.update({
            _id: obj._id
        }, obj, (err, result) => {

            console.log(result);

            if (result.nModified == "1") {
                res.json({
                    success: true,
                    msg: "Updated successfully"
                });
            } else if (err) {
                if (err.code == 11000) {
                    res.json({
                        success: false,
                        msg: "Please try to use unique slug."
                    });
                }
            } else {
                res.json({
                    success: false,
                    msg: "Some errors occurred"
                });
            }
        });
    }
};



exports.faqDetail = (req, res) => {
    faqModel.findOne({
        _id: req.query.id
    }, (err, result) => {
        if (result) {
            res.json({
                success: true,
                faq: result
            });
        } else {
            res.json({
                success: false,
                faq: []
            });
        }
    });
};

exports.trashFaq = (req, res) => {

    faqModel.update({
    	 _id: req.query.id
    	}, {
    		$set: {
    			trash: true
    		}
    	}, (err, result) => {
	        if (result.nModified == '1') {
	            res.json({
	                success: true,
	                msg: msg.deleted
	            });
	        } else {
	            res.json({
	                success: false,
	                msg: msg.someError
	            });
	        }    		
    	});

};	 