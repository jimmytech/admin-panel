'use strict';

const path                  = require('path'),
    response                = require(path.resolve('./config/libs/response')),
    msg                     = require(path.resolve('./config/libs/message')),
    get                     = require(path.resolve('./config/env/default')),
    blogModel               = require(path.resolve('./models/blog_model'));


exports.getPostsList = (req, res) => {
    let page = req.query.page;
    let limit = get.pagingLimit;
    blogModel.aggregate([{
        $match: {
            trash: false
        }
    }, {
        $skip: (page - 1) * limit
    }, {
        $limit: limit
    }, {
        $project: {
            title:1,
            sort:1,
            postType:1,
            status:1,
            author:1
        }
    }], (err, result) => {
        if (result.length > 0) {

            blogModel.aggregate([{
                $match: {
                    trash: false
                }
            }, {
                $count: "total"
            }], (error, count) => {
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
                    table: true,
                    search: false,
                    data: result,
                    paging: paging
                });
            });

        } else {
            res.json({
                success: false,
                table: false,
                search: false,
                message: 'No Result Found'
            });
        }
    });
};

exports.search = (req, res) => {
    let search = req.query.searchFor.replace(/ /g, "|");
    blogModel.aggregate([
    {
        $match: {
            $and: [
                {
                   trash: false 
                },
                {
                    $or: [
                        {
                            title: {
                                $regex: search,
                                $options: 'i'
                            }
                        },
                        {
                            author: {
                                $regex: search,
                                $options: 'i'                                
                            }
                        }                        
                    ]
                }
            ]           
        }
    }, {
        $project: {
            title:1,
            sort:1,
            postType:1,
            status:1,
            author:1            
        }
    }], (err, result) => {
        if (result.length>0) {
            pagination();
            res.json({
                success: true,
                table: true,
                search: true,
                data: result,
            });            
        }else{
            res.json({
                success: false,
                table: true,
                search: true
            });              
        }

    });
};

function pagination() {
    
}

exports.addUpdatePost = (req, res) => {
    let obj = req.body.userData;
    if (req.files.length > 0) {
        let image = req.files[0].path;
        obj.image = image.substring(image.indexOf("/")+1);
    }
    if (obj._id) {
        blogModel.findOneAndUpdate({
            _id: obj._id
        }, obj, (err, result) => {
            if (result) {
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
        obj.doc_type = "blog";
        let data = new blogModel(obj);
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

exports.postInfo = (req, res) => {
    blogModel.findOne({
        _id: req.query.id
    }, (err, result) => {
        if (result) {
            res.json({
                success: true,
                data: result
            });
        } else {
            res.json({
                success: false,
            });
        }
    });
};



exports.deletePost = (req, res) => {
    // blogModel.remove({"_id": req.params.id}, (err, result)=>{
    //     if (result.result.n=='1') {
    //         res.json({
    //             success: true,
    //             msg: msg.deleted
    //         });           
    //     }else{
    //         res.json({
    //             success: false,
    //             msg: msg.someError
    //         });   
    //     }
    // });
    blogModel.update({
        "_id": req.params.id
    }, {
        $set: {
            trash: true
        }
    }, (err, result)=>{
        console.log(err|| result);
    });
};