const path			= require('path'),
	msg				= require(path.resolve('./config/libs/message')),
	categoryModel	= require(path.resolve('./models/category_model'));



exports.categortList = (req, res) => {
	categoryModel.find({
		trash: false
	}, (err, result) => {
		if (result.length>0) {
			res.json({
				success: true,
				result: result
			});			
		}else{
			res.json({
				success: false
			});				
		}
	});

};	

exports.categoryInfo = (req, res) => {

	categoryModel.findById(req.params.id, (err, result) => {
		if (result) {
			res.json({
				success: true,
				result: result
			});	
		}else {
			res.json({
				success: false,
				msg: msg.someError		
			});				
		}
	});

};


exports.insertUpdateCategory = (req, res) => {

    let body = req.body;
    if (body._id) {

        categoryModel.update({
            "_id": body._id
        }, {
            $set: body
        }, (err, result) => {
            if (result.nModified == "1") {
                res.json({
                    success: true,
                    msg: msg.updated
                });
            } else {
                res.json({
                    success: false,
                    msg: msg.someError
                });
            }
        });

    } else {

        if (body.child == 'root') {

            let data = new categoryModel(body);
            data.save((err, result) => {
                if (result) {
                    res.json({
                        success: true,
                        msg: msg.saved
                    });
                } else {
                    res.json({
                        success: false,
                        msg: msg.someError
                    });
                }
            });

        } else{

            categoryModel.update({
                "_id": body.child
            }, {
                $push: {
                    sub_category: body
                }
            }, (err, result) => {
                if (result.nModified == "1") {
                    res.json({
                        success: true,
                        msg: msg.updated
                    });
                } else {
                    res.json({
                        success: false,
                        msg: msg.someError
                    });
                }
            });
        }

    }
};

exports.deleteCategory = (req, res) => {

	categoryModel.update({
		"_id": req.params.id
	}, {
		$set: {
			trash: true
		}
	}, (err, result) => {
            if (result.nModified == "1") {
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

exports.dropDownList = (req, res) => {
    categoryModel.find({
        trash: false
    }, {
        title:1
    }, (err, result) => {
        res.json({
            success: true,
            result: result
        });
    });

};