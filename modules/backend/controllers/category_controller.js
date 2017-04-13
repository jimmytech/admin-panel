const path = require('path'),
    msg = require(path.resolve('./config/libs/message')),
    categoryModel = require(path.resolve('./modules/backend/models/category_model'));


exports.categortList = (req, res) => {

    categoryModel.aggregate([

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

exports.categoryInfo = (req, res) => {

    categoryModel.findById(req.params.id, (err, result) => {
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

/*insert or update category*/

exports.insertUpdateCategory = (req, res) => {

    let body = req.body.cat;
    
    if (req.files.length > 0) {
        body.image = req.files[0].path.replace("public/", "");
    }
    
    if (body._id) {

        delete body.created_at;
        delete body.updated_at;

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

