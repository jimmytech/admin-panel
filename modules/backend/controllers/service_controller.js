const path = require('path'),
    msg = require(path.resolve('./config/libs/message')),
    serviceModel = require(path.resolve('./modules/backend/models/service_model'));


exports.insertUpdateService = (req, res) => {

	if (req.body._id) {
		delete req.body.created_at;
		delete req.body.updated_at;

		console.log(req.body);
		serviceModel.update({
			_id: req.body._id 
		}, req.body, (err, result) => {

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

	}else{
		let data = new serviceModel(req.body);
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
	}

};


exports.serviceList = (req, res) => {

    serviceModel.aggregate([

        {
            "$match": {
                "trash": false
            }
        }, {
            "$project": {
                "updated_at": 0,
                "created_at": 0,
                "slug": 0,
                "__v": 0,
                "trash": 0
            }

        }
    ], (err, result) => {

        if (result.length > 0) {

            res.json({
                success: true,
                result: result
            });
        } else {
            res.json({
                success: false
            });
        }


    });
};

exports.serviceInfo = (req, res) => {

    serviceModel.findById(req.params.id,  (err, result) => {
        if (result) {
            res.json({
                success: true,
                result: result
            });
        } else {
            res.json({
                success: false,
                msg: msg.someError
            });
        }
    });	

};	

exports.trash = (req, res) => {

    serviceModel.update({
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