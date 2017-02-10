'use strict';

const path = require('path'),
    blogStoryModel = require(path.resolve('./models/story_blog_model'));

exports.addUpdatePost = (req, res) => {
    let obj = req.body.userData;
    if (req.files.length > 0) {
        let image = req.files[0].path;
        obj.image = image.substring(image.indexOf("/")+1);
    }
    if (obj._id) {
        blogStoryModel.findOneAndUpdate({
            _id: obj._id
        }, obj, function(err, result) {
            console.log(result);
            if (result) {
                res.json({
                    success: true,
                    msg: "Updated successfully"
                });
            } else {
                res.json({
                    success: false,
                    msg: "Some errors occurred"
                });
            }
        });
    } else {
        let data = new blogStoryModel(obj);
        data.save(function(err, result) {
            if (result) {
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
    }

};

exports.postDataToEdit = (req, res) => {
    blogStoryModel.find({
        _id: req.query.id
    }, function(err, result) {
        if (result.length > 0) {
            res.json({
                success: true,
                data: result
            });
        } else {
            res.json({
                success: false,
                data: ""
            });
        }
    });
};

exports.getPostData = (req, res) => {
    blogStoryModel.find({}, function(err, result) {
        if (result.length > 0) {
            res.json({
                success: true,
                data: result
            });
        } else {
            res.json({
                success: false,
                data: ""
            });
        }
    });
};

exports.delete = (req, res) => {
    blogStoryModel.remove({"_id": req.params.id}, (err, result)=>{
        if (result.result.n=='1') {
            res.json({
                success: true,
                msg: "Deleted successfully"
            });           
        }else{
            res.json({
                success: false,
                msg: "Some errors occurred"
            });   
        }
    });
};