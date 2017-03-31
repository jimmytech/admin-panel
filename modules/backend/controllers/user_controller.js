const path      = require('path'),
    crypto      = require('crypto'),
    msg         =   require(path.resolve('./config/libs/message')),
    getDefault  = require(path.resolve('./config/env/default')),
    userModel   = require(path.resolve('./modules/frontend/models/user_model'));




function createAccount() {
    var gender = ["male", "female"];
    var userType = ["customer", "serviceProvider"];
    var status = [false, true];
    var randomByte = crypto.randomBytes(5).toString('Base64');
    var obj = {
        firstname: `John n ${randomByte}`,
        email: `${randomByte}@gmail.com`,
        password: "123456",
        gender: gender[Math.floor(Math.random() * gender.length)],
        status: status[Math.floor(Math.random() * status.length)],
        // user_type: userType[Math.floor(Math.random() * userType.length)]

    };
    var data = new userModel(obj);
    data.save((err, result) => {
        // console.log(err||result);
    });
}

function loop() {

    for (let i = 0; i < 1; i++) {
        createAccount();
    }
}


// loop();


function userType(resultFor) {
    var type;
    if (resultFor == 'service-providers') {
        type = 'serviceProvider';
    } else if (resultFor == 'customers') {
        type = 'customer';
    }

    return type;
}

exports.userList = (req, res) => {

    let request = req.query,
     limit = getDefault.pagingLimit,
     page = request.page,
     sortBy = request.sortBy,
     sortType = request.sortType;

    userModel.aggregate([

        {
            "$match": {
                "trash": false,
            }
        }, {
            $sort: {
                [sortBy]: parseInt(sortType)
            }
        }, {
            $skip: (page - 1) * limit
        }, {
            $limit: limit
        }, {
            "$project": {
                "first_name": 1,
                "email": 1,
                "status": 1,
                "gender": 1
            }
        }
    ], (err, result) => {

        if (result) {
            userModel.aggregate([{
                "$match": {
                    "trash": false,
                }
            }, {
                $count: "total"
            }], (err, count) => {

                if (count.length>0) {
                    let total = count[0].total;
                    let paging = {
                        page: page,
                        limit: limit,
                        count: total,
                        current: result.length,
                        prevPage: (page > 1),
                        nextPage: (total > (page * limit))
                    };
                    res.json({
                        success: true,
                        paging: paging,
                        result: result
                    });                    
                }

            });


        } else {

            res.json({
                success: false
            });

        }

    });

};

exports.search = (req, res) => {

    let request = req.query,
        type = userType(request.user),
        page = request.page,
        limit = getDefault.pagingLimit,
        search = request.search,
        query = {
            "$and": [{
                "trash": false,
                // "user_type": type
            }, {

                "$or": [{
                    "first_name": {
                        $regex: search,
                        $options: 'i'
                    }
                }, {
                    "last_name": {
                        $regex: search,
                        $options: 'i'
                    }
                }, {
                    "email": {
                        $regex: search,
                        $options: 'i'
                    }
                }, {
                    "gender": {
                        $regex: search,
                        $options: 'i'
                    }
                }]
            }]
        };

    userModel.aggregate([{

        "$match": query
    }, {
        $skip: (page - 1) * limit
    }, {
        $limit: limit
    }, {
        "$project": {
            "first_name": 1,
            "email": 1,
            "status": 1,
            "gender": 1
        }
    }], (err, result) => {

        if (result.length) {

            userModel.aggregate([

                {
                    "$match": query
                }, {
                    $count: "total"
                }
            ], (err, count) => {

                let total = count[0].total;
                let paging = {
                    page: page,
                    limit: limit,
                    count: total,
                    current: result.length,
                    prevPage: (page > 1),
                    nextPage: (total > (page * limit))
                };
                res.json({
                    success: true,
                    paging: paging,
                    result: result
                });
            });
        } else {

            res.json({
                success: false
            });

        }
    });

};


exports.updateUser = (req, res) => {

    let data = req.body;

    delete data.created_at;
    delete data.updated_at;

    userModel.update({
        "_id": req.body._id
    }, data , (err, result) => {
        if (result.nModified == "1") {
            res.json({
                success: true,
                msg: msg.updated
            });
        }else{
            res.json({
                success: false,
                msg: msg.tryAgain
            });         
        }
    });
};