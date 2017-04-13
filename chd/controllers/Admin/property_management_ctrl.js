'use strict';

const	path     	 = require('path'),
		user                    = require(path.resolve('./models/User')),
 		config 		 = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
		property     = require(path.resolve('./models/Property'));

exports.propertyListing = (req, res, next)=>{
	let data = req.query;
	let sort = req.query.sort === 'desc' ? -1 : 1;
	let limit = config.userManagementLimit;	
	let paginate = data.paginate;
	let obj = {
		all: {},
		landlord: {upload_by: 'landlord'},
		agent:  {upload_by: 'agent'},
		admin: {upload_by: 'admin', admin_id: data.find}
	};
	let query = obj[data.type];
	property.aggregate(
			{
				$match: query
			},
		 {
            $sort: {
                created: sort
            }
        }, {
            $skip:(paginate-1)*limit
        }, {
            $limit: limit
        }, {
            $project: 
            {
				property_for: 1,
				created: 1,
				owner: 1,
				by_admin:1,
				slug: 1,

				virtual_name: { $concat: [ "$address.address1", ", ", "$address.house_number", ", ", "$address.postcode", ", ", "$address.town", ", ", "$address.county" ] }, 
            }
        }, (err, result)=>{
        	if(err){
        		 return next(err);
        	} else if (result.length>0) {
        		property.count(query, function (e, count) {
                    let paging = {
                        'page' : paginate,
                        'current' : result.length, // currently showing results count
                        'count' : count,
                        'prevPage' : (paginate > 1),
                        'nextPage' : (count > (paginate * limit)),
                        'limit' : limit
                    };  
                    res.json({
                        success: true,
                        searchBar: true,
                        list: result,
                        paging: paging
                    }); 
        		});
        	} else {
                res.json({
                    success: false,
                    searchBar: false,
                    list: []
                });
        	}		
	});
};

exports.updateProperty = (req, res, next)=>{
	console.log(req.body._id);
	property.update({_id: req.body._id}, {
		$set: req.body
	}, function(err, update){
		if(err){
			return next(err);
		} else if (update.nModified == '1') {
			res.json({
				success: true
			});
		}
	});
};

exports.propertyInfo = (req, res, next)=>{
	property.findOne({slug: req.query.key}, {
	}, (err, result)=>{		
		if(err){
			return next(err);
		} else if (result !== null) {
			 console.log(result);
			res.json({
				success: true,
				list: result
			});
		}else{
			res.json({
				success: false,
				list: []
			});
		}
	});
};

exports.deletePropertyInfo = (req, res, next)=>{
	property.findOne({slug: req.params.key}).remove().exec((err, removed)=>{
			if (err) {
				return next(err);
			} else if (removed.result.n==1) {
				res.json({
					success: true
				});
			} else{
				res.json({
					success: false
				});
			}
	});
};

exports.searchProperty = (req, res, next)=>{
	console.log(req.query.find);
	property.find({
		$text: {
			$search: req.query.find
		}
	}, (err, result)=>{
		if (err) {
			return next(err);
		} else if (result.length>0) {
            res.json({
                success: true,
                searchBar: true,
                list: result,
                paging: 'paging'
            }); 			
		} else {
	        res.json({
	            success: false,
	            searchBar: true,
	            list: []
	        });
		}
	});
};

exports.userList = (req, res, next)=>{
	user.aggregate([{
		$sample: {
			size: 5
		}
	}], (err, result)=>{
		if (err) {
			return next(err);
		} else{
            res.json({
                list: result
            }); 
		}
	});
};

exports.searchUser = (req, res, next) =>{
	let search = req.query.find;
    user.find({
        $and: [{
                $or: [{
                    email: {
                        $regex: search,
                        $options: 'i'
                    }
                }, {
                    firstname: {
                        $regex: search,
                        $options: 'i'
                    }
                }]
            },
        ]
    }, (err, result) => {
    	console.log(result);
        if (result.length < 1) {
            res.json({
                success: false,
                list: []
            });
        } else {
            res.json({
                success: true,
                list: result
            });
        }
    });
};