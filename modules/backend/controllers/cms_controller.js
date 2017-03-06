'use strict';

const path                  = require('path'),
    msg                     = require(path.resolve('./config/libs/message')),
    blogModel               = require(path.resolve('./models/blog_model')),
    cmsModel                = require(path.resolve('./models/cms_model'));


exports.showPagesList = (req, res) => {
    cmsModel.find({
        "trash": false
    }, {
        title: 1,
        top: 1,
        bottom: 1,
        status: 1,
        sort: 1
    }, function(err, result) {
        if (result.length < 1) {
            res.json({
                success: false
            });
        } else {
            res.json({
                success: true,
                page: result
            });
        }
    });
};

exports.insertUpdate = (req, res) => {
    let obj  = req.body.pageInfo;
    if (req.files.length > 0) {
        let image = req.files[0].path;
        obj.image = image.substring(image.indexOf("/")+1);
    } 
    if (obj._id) {
        cmsModel.findOneAndUpdate({
            _id: obj._id
        }, obj, function(err, result) {
            if (result) {
                res.json({
                    success: true,
                    msg: "Updated successfully"
                });
            } else {
                res.json({
                    success: false,
                    msg: 'Some errors occurred'
                });
            }
        });
    } else {
        let page = new cmsModel(obj);
        page.save(function(err, result) {
            if (err || result.title !== obj.title) {
                res.json({
                    success: false,
                    msg: 'Some errors occurred'
                });
            } else {
                res.json({
                    success: true,
                    msg: "Added successfully"
                });
            }
        });
    }
};



exports.editpage = (req, res) => {
    cmsModel.findOne({
        _id: req.query.id
    }, (err, result) => {
        if (result) {
            res.json({
                success: true,
                page: result
            });
        } else {
            res.json({
                success: false,
                page: ""
            });
        }
    });
};

exports.deletePage = (req, res) => {
    cmsModel.update({
        "_id": req.query.id
    }, {
        $set: {
            trash: true
        }
    }, (err, result)=>{
        console.log(result);
        if (result.nModified == 1) {
            res.json({
                success: true,
                msg: msg.deleted
            });  
        }else{
            res.json({
                success: false,
                msg: msg.someError
            }); 
        }
    });    
};



// function createRecord(){
//         let obj = {
//             title: "The repl module exports the repl.REPLServer class. While running, instances of repl.REPLServer will accept individual lines of user input, evaluate those according to a user-defined evaluation function, then output the result. Input and output may be from stdin and stdout, respectively, or may be connected to any Node.js stream.",
//             short_description: "The repl module exports the repl.",
//             content: "he repl module exports the repl.REPLServer class. While running, instances of repl.REPLServer will accept individual lines o",
//             meta_title: "epl module exports the repl.REPLS",
//             meta_description: "le exports the repl.REPLServer cla",
//             meta_keywords: "le exports the repl.REPLServer cla",
//             meta_content: "Instances of repl.REPLServer support au",
//             top:1,
//             bottom:1,
//             slug: "The repl module exports the repl",
//         };

//         for(let i = 1; i<10000; i++){
//          let page = new blogModel(obj);
//         page.save(function(err, result) {
//             console.log(err||result);
//         });

//         }
// }








// setInterval(() => {

//     createRecord();

// }, 5000);