'use strict';

const path      = require('path'),
    async       = require('async'),
    _           = require('lodash'),
    fs          = require('fs'),
    config      = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    stream      = require(path.resolve('./config/lib/streamifier')),
    Property    = require(path.resolve('./models/Property')),
    User        = require(path.resolve('./models/User')),
    Property_additional = require(path.resolve('./models/Property_additional')),
    paginate    = require(path.resolve('./config/lib/paginate')),
    mongoose    = require('mongoose'),
    ObjectId    = require('mongodb').ObjectID,
    SubscriptionPlan = require(path.resolve('./models/SubscriptionPlan')),
    response 	= require(path.resolve('./config/lib/response'));


exports.uploadProperty =  (req, res, next) => {
    /* check if body is empty */
    if(_.isEmpty(req.body) ){
        return next({ message: 'No data received' });
    }
    
    let propertyObj;
    switch( req.is(['multipart/form-data','application/x-www-form-urlencoded', 'application/json']) ) {

        case 'multipart/form-data':
            propertyObj = (typeof req.body.property === 'string') ? JSON.parse(req.body.property) : req.body;
            break;

        case 'application/json':
            propertyObj = req.body;
            break; 

        case 'application/x-www-form-urlencoded':
            propertyObj = req.body;
            break;                

        default:
            return next({ message: 'Unknown request type', name: req.get('Content-Type') });           
    }

    // check if body has files
    if( !_.isEmpty(req.files) ){
        stream.handleFile({
            files: req.files, 
            destination: config.property_image_full_destination, 
            display_path: config.property_image_display_path, 
            file_extensions: config.file_extensions
        }, function (err, image) {
            if(err){
                next(err);
            }
            /* Push image object in properties main object */
            propertyObj.image = image;   
            _save(propertyObj, req, res, next);
        });
    } else {
        _save(propertyObj, req, res, next);
    }
};

function _save(obj, req, res, next) {
    if (obj.address) {
        let coordinates = [parseFloat(obj.address.longitude), parseFloat(obj.address.latitude)];
        obj.address.loc = { type: "Point", coordinates: coordinates}; 
    }
    let property = new Property(obj);
    property.save(function(err, result){
        if(err){
            return res.send( err );
        }
        res.json(
            response.success({
                message: 'Property details has saved successfully',
                record: { property_id: result._id, slug: result.slug },
                success: true
            })
        );
    }); 
}

/**
 * Get property by property id
 */
exports.propertyBySlug = (req, res, next) => {
    // To-DO make slug a index
    Property.findOne({slug: req.params.slug})
    .populate('user_id', 'firstname lastname email role phone profile_image floor_plan')
    .exec(function(err, result){
        if(err){
            return next(err);
        }
        res.json(
            response.success({
                record: result,
                success: true
            })    
        );
    });
};


exports.updateCartServices = (req, res, next) => {
    Property.update({_id: req.params.property_id}, { $pull: { 'cart':  {_id: req.params.cart_id}} }, (err, result)=>{
        if(err){
            next(err);
        } else {
            res.json(
                response.success({
                    message: 'Cart has updated successfully',
                    success: true
                })    
            );   
        }
    });
};

exports.checkout = (req, res, next) => {
    let items = req.body;
    Property.update({_id: req.params.id}, { $pullAll: { 'cart':  items.paid_services}, $push: { 'paid_services':  items.paid_services} }, function(err, result){
        if(err){
            next(err);
        } else {
            res.json(
                response.success({
                    message: 'Paid services has updated successfully',
                    success: true
                })    
            );   
        }
    });
};

exports.paginate = (req, res, next) => {
    let userid = req.params.userid;
    let page = req.query.page || 1;
    let sortBy = (req.query.sort) ? { monthly_rent: _.toNumber(req.query.sort), sale_price: _.toNumber(req.query.sort)} : {created: -1};

    async.parallel({
        count: function(callback) {
            Property.count({user_id: userid}, function(err, count){
                callback(err, count);
            });
        },
        properties: function(callback) {
             // TODO - create index for userid later
            Property.aggregate([
                { $match: { user_id: mongoose.Types.ObjectId(userid) } },
                { $project: {
                    image_count: { $size: "$image" }, 
                    image: { $slice: ["$image", 1] }, 
                    virtual_name: { $concat: [ "$address.address1", ", ", "$address.house_number", ", ", "$address.postcode", ", ", "$address.town", ", ", "$address.county" ] }, 
                    bathroom: 1, beds: 1, created: 1, description: 1, isPublished: 1, monthly_rent: 1, user_id: 1, sale_price: 1, slug: 1, property_for: 1, property_type: 1, parking: 1, cover_photo: 1, default_image: 1, address: 1, floor_plan:1} 
                },
                { $sort: sortBy },
                { $skip: (page-1)*config.docLimit },
                { $limit: config.docLimit }
            ])
            .exec( function(err, result){
                callback(err, result);
            });
        }
    }, function(err, result) {
        if(err){
            return next(err);
        }
        
        res.json(
            response.success({
                success: true,
                records: result.properties,
                paging: paginate._paging(result.count, result.properties, page)
            })    
        );
    });
};

exports.updateProperty = (req, res, next) => {
    
    if( _.isEmpty(req.body) ){
        return res.json(
            response.errors({
                message: 'No data received to update',
                success: false
            })
        );
    }

    Property.update(
        { _id: req.params.id }, 
        req.body, 
        { runValidators: true, setDefaultsOnInsert: true},
        function(err, property){
            
            if(err){
                return next(err);
            }
            res.json(
                response.success({
                    success: true,
                    message: 'Property details update successfully'
                })
            );
        }
    );    
};

exports.deleteProperty = (req, res, next) => {

    async.waterfall([
        function (done) {
            Property.findOneAndRemove({_id: req.params.id}, function(err, doc){
                done(err, doc.image);
            });
        },
        function (images, done){
            async.each(images, function(image, callback){
                if(image.name === config.image_name){
                    callback();
                } else {
                    
                    fs.unlink( `public/${image.path}${image.name}` , function(err, success){
                        fs.unlink( `public/${image.thumb_path}${image.thumb_name}` , function(err, success){
                            callback(err);
                        });
                    });    
                }
                
            }, function(err){
		        done(err);
	        });    
        }
    ], function(err, success){
        if(err){
            return next(err);
        }
        res.json(
            response.success({
                success: true,
                message: 'Property details removed successfully'
            })
        );
    });
};

exports.search = (req, res, next) => {  
    let searchObj = req.body;
    let page = req.query.page || searchObj.page || 1;
    if( _.isEmpty(searchObj) ){
        return res.json(
            response.success({
                success: true,
                records: [],
                paging: {}
            })
        );
    }

    /* Sorting options */
    let sortBy = { created: -1 };
    let sortOption = req.query.sort || searchObj.sort;
    if( sortOption && searchObj.property_for === 'sale'){
        sortBy = { sale_price: _.toNumber(sortOption) };
    } else if( sortOption && searchObj.property_for === 'rent'){
        sortBy = { monthly_rent: _.toNumber(sortOption) };
    }
    
    let accumulator = pipelineStages(searchObj, page, sortBy);
    
    async.parallel({
        count: function(callback) {
            Property.aggregate(accumulator.countStages, function(err, count){
                callback(err, count);
            });
        },
        properties: function(callback) {
            Property.aggregate(accumulator.pipeline)
            .exec(function (err, result) {
                    Property.populate(result, { path: 'user_id', select: {email:1, firstname:1, lastname:1, profile_image: 1, floor_plan:1, "phone.telephone": 1}},function (err, populatedResult) {
                        callback(err, populatedResult);
                    });
                }
            );
        }
    }, function(err, result){
        if(err){
            return next(err);
        }
        
        let count = (result.count.length) > 0 ? result.count[0].count: 0;
        res.json(
            response.success({
                success: true,
                records: result.properties,
                paging: paginate._paging(count, result.properties, page)
            })
        );
    });
};

function pipelineStages(searchObj, page, sortBy) {
    let pipeline = [
        { $project: { 
            address: 1, 
            additional_exclusion: 1, 
            bathroom: 1, 
            beds: 1, 
            created: 1, 
            description: 1, 
            isPublished: 1, 
            image_count: { $size: "$image" }, 
            image: { $slice: ["$image", 1] }, 
            default_image: 1,
            cover_photo: 1, 
            monthly_rent: 1, 
            property_type: 1, 
            parking: 1,
            user_id: 1, 
            virtual_name: { $concat: [ "$address.address1", ", ", "$address.house_number", ", ", "$address.postcode", ", ", "$address.town", ", ", "$address.county" ] }, 
            sale_price: 1,
            slug: 1,
            property_for: 1,
            available_date: 1,
            available_format_date: { $dateToString: { format: "%m-%d-%Y", date: "$available_date" } },
            under_offer: 1,
            sold_stc: 1,
            floor_plan:1,
            reserved:1,
            furnished:1,
            features:1
        } }  
    ];

    let stage_2 = [{ property_for: searchObj.property_for },{ isPublished: true }];
    if( !_.isEmpty(searchObj.search_address) ){
        // 1. Address
        pipeline.unshift(
            { $match: { $text: { $search: searchObj.search_address } } },
            { $sort: { score: { $meta: "textScore" } } }
        );

    } 
    /* ==================== Rent Price ======================= */ 
    if ( searchObj.min_price_per_month && searchObj.max_price_per_month && searchObj.min_price_per_month !== 'any' && searchObj.max_price_per_month !== 'any' ) {
        // 2. if both prices are availabele
        stage_2.push({ monthly_rent : { $gte: _.toNumber(searchObj.min_price_per_month) , $lte: _.toNumber(searchObj.max_price_per_month) } });

    } else if( searchObj.min_price_per_month && searchObj.min_price_per_month !== 'any' ) {
        // 3. For only min price
        stage_2.push({ monthly_rent : { $gte:  _.toNumber(searchObj.min_price_per_month)  } });

    } else if ( searchObj.max_price_per_month && searchObj.max_price_per_month !== 'any' ) {
        // 4. For only max price
        stage_2.push({ monthly_rent : { $lte:  _.toNumber(searchObj.max_price_per_month)  } });
    }

    /* ==================== Sales Price ======================= */ 
    if ( searchObj.min_sale_price && searchObj.max_sale_price && searchObj.min_sale_price !== 'any' && searchObj.max_sale_price !== 'any' ) {
        // 2. if both prices are availabele
        stage_2.push({ sale_price : { $gte: _.toNumber(searchObj.min_sale_price) , $lte: _.toNumber(searchObj.max_sale_price) } });

    } else if( searchObj.min_sale_price && searchObj.min_sale_price !== 'any' ) {
        // 3. For only min price
        stage_2.push({ sale_price : { $gte:  _.toNumber(searchObj.min_sale_price)  } });

    } else if ( searchObj.max_sale_price && searchObj.max_sale_price !== 'any' ) {
        // 4. For only max price
        stage_2.push({ sale_price : { $lte:  _.toNumber(searchObj.max_sale_price)  } });
    } 
    if ( searchObj.min_beds && searchObj.max_beds && searchObj.min_beds !== 'any' && searchObj.max_beds !== 'any' ) {
        // 5. If both beds values are available
        /* Last changes
        let searchBedObj = {};
        if( searchObj.min_beds === 'studio' || searchObj.max_beds === 'studio' ){
            searchBedObj = { beds: 'studio' };
        } else {
            searchBedObj = { beds: { $gte: searchObj.min_beds , $lte: searchObj.max_beds } };
        }*/

        stage_2.push({ beds: { $gte: _.toNumber(searchObj.min_beds) , $lte: _.toNumber(searchObj.max_beds) } });
    } else if ( searchObj.min_beds && searchObj.min_beds !== 'any' ) {
        //6. For only min bed
        //let minBedObj = searchObj.min_beds === 'studio' ? { beds: searchObj.min_beds } : { beds: { $gte: searchObj.min_beds } };

        stage_2.push({ beds: { $gte: _.toNumber(searchObj.min_beds) } });
    }  else if ( searchObj.max_beds && searchObj.max_beds !== 'any' ) {
        //7. For only max bed
        //let maxBedObj = searchObj.max_beds === 'studio' ? { beds: searchObj.max_beds } : { beds: { $lte: searchObj.max_beds } };
        
        stage_2.push({ beds: { $lte: _.toNumber(searchObj.max_beds) } });
    } 
    if ( searchObj.property_type && searchObj.property_type !== 'any') {
        //7. For rental type
        let type = _.isObjectLike(searchObj.property_type) ? searchObj.property_type._id: searchObj.property_type;
        stage_2.push({ "property_type._id": type });
    }
    if ( searchObj.available_date ) {
        stage_2.push({ available_format_date:  searchObj.available_date  });
    }

    if ( searchObj.under_offer ) {
        stage_2.push({ under_offer:  searchObj.under_offer  });
    }
    
    if ( searchObj.sold_stc ) {
        stage_2.push({ sold_stc:  searchObj.sold_stc  });
    }

    if ( searchObj.let_agreed ) {
        stage_2.push({ let_agreed:  searchObj.let_agreed  });
    }

    if ( searchObj.reserved ) {
        stage_2.push({ reserved:  searchObj.reserved  });
    }     

    if ( searchObj.furnishingType !== undefined && searchObj.furnishingType !== 'undefined' ) {
        stage_2.push({ furnished:  searchObj.furnishingType  });
    }   
    if ( !_.isEmpty(searchObj.additionalFeature)) {  
        stage_2.push({ "features._id":  {$in: searchObj.additionalFeature}});  
    } 

    /* ==================== filter property by using added date ======================= */ 
    if (!_.isEmpty(searchObj.added) && searchObj.added !== 'any') {
        let dateAdded;
        switch(searchObj.added) {
            case '24-hours':
                dateAdded = {_id: {$gte: ObjectId.createFromTime(Date.now() / 1000 - 24 * 60 * 60) }};
                break;
            case '2-days':
            case '5-days':
            case '7-days':
            case '14-days':
            case '30-days':
            let days = {'2-days':2, '5-days':5,'7-days':7,'14-days':14, '30-days': 30}
                dateAdded = {"created": {$gte: (new Date((new Date()).getTime() - (days[searchObj.added] * 24 * 60 * 60 * 1000))) }};
                break;
            default:
            throw new Error('Unknown added date type');
        }
        stage_2.push(dateAdded);  
    }

    /* ==================== filter property by using miles ======================= */ 
    if (searchObj.radius && searchObj.radius !== 'any' && !_.isEmpty(searchObj.coordinates)) {
        let coordinates = [parseFloat(searchObj.coordinates[0]), parseFloat(searchObj.coordinates[1])];          
        let mileSearch = {"address.location": {$geoWithin: {$centerSphere: [coordinates , searchObj.radius / 3963.2 ]}}};
        stage_2.push(mileSearch);  
    }
        
    // Push stage 2 into pipeline
    if( !_.isEmpty(searchObj.search_address) ){
        pipeline.splice(3,0,{ $match: { $and: stage_2 }});
    } else {
        pipeline.push({ $match: { $and: stage_2 }});   
    }

    // 3rd stage for count
    let countStages =  _.clone(pipeline);
    countStages.push({ 
        $group: { _id: null, count: { $sum: 1 } }
    });

    // 3rd stage of pipeline
    pipeline.push(
        { $sort: sortBy },
        { $skip: (page-1)*config.docLimit },
        { $limit: config.docLimit }
    );
    //countStages.$and = stage_2;
    return { pipeline: pipeline, countStages: countStages };
}

/*  */
exports.propertyAdditionals = (req, res, next) => {
    
    let type = req.params.type;

    switch(type){

        case 'additionalFeature':
            _getAdditionalFeatures(type, req, res, next);
            break;

        case 'additionalExclusion':    
            _getAdditionalExclusion(type, req, res, next);
            break;

        case 'heating':
        case 'location':
        case 'authority':
        case 'property_type':
        case 'age':
        case 'style':
        case 'parking':
            _getPropertyOptions(type, req, res, next);
            break;
        case 'additionalService':
            _getPaidServices(type, req, res, next);
            break;    

        default:
        res.json(
            response.errors({
                message: 'Unknown type',
                success: false
            })
        );           
    }
};

function _getPaidServices(type, req, res, next) {
    SubscriptionPlan.findOne({
        "type": type
    }, {
        "_id": 0,
        "additional_services.name": 1,
        "additional_services._id": 1,
        "additional_services.price": 1,        
        "additional_services.tooltip_text": 1
    }, (err, result) => {
        if(err){
            return next(err);
        }        
        res.json(
            response.success({
                success: true,
                record: (result) ? result.additional_services : []
            })
        );
    });
}

// Property additional features
function _getAdditionalFeatures(type, req, res, next) {
    Property_additional.aggregate([
        { $project: { type: 1,  additional_feature: 1, _id: 0} },
        { $match: { type: type } },
        { $unwind: "$additional_feature" },
        { $match: { "additional_feature.status": true } },
        { $project: { "_id": "$additional_feature._id", "name": "$additional_feature.name" }}
    ], function (err, result) {
        if(err){
            return next(err);
        }
        
        res.json(
            response.success({
                success: true,
                record: result
            })
        );
    });
}

// Property additional Exclusion
function _getAdditionalExclusion(type, req, res, next, cb) {
    Property_additional.aggregate([
        { $project: { type: 1,  additional_exclusion: 1, _id: 0} },
        { $match: { type: type } },
        { $unwind: "$additional_exclusion" },
        { $match: { "additional_exclusion.status": true } },
        { $project: { "_id": "$additional_exclusion._id", "name": "$additional_exclusion.name", "type": "$additional_exclusion.exclusion_type" } }
    ], function (err, result) {
        if(err){
            return next(err);
        }
        res.json(
            response.success({
                success: true,
                record: result
            })
        );
    });
}

// Property rental type
function _getPropertyOptions(type, req, res, next) {
    let checkStatus = `${type}.status`;
    Property_additional.aggregate([
        { $project: { type: 1,  [type]: 1, _id: 0} },
        { $match: { type: 'option' } },
        { $unwind: `$${type}` },
        { $match: { [checkStatus]: true } },
        { $project: { "_id": `$${type}._id`, "name": `$${type}.name` } }
    ], function (err, result) {
        if(err){
            return next(err);
        }
        
        res.json(
            response.success({
                success: true,
                record: result
            })
        );
    });
}

// Update property
exports.update_property = function (req,res, next) {
    if(_.isEmpty(req.body) ){
        return next({ message: 'No data received' });
    }
    
    let propertyObj;
    switch( req.is(['multipart/form-data','application/x-www-form-urlencoded', 'application/json']) ) {

        case 'multipart/form-data':
            propertyObj = (typeof req.body.property === 'string') ? JSON.parse(req.body.property) : req.body;
            break;

        case 'application/json':
            propertyObj = req.body;
            break; 

        case 'application/x-www-form-urlencoded':
            propertyObj = req.body;
            break;                

        default:
            return next({ message: 'Unknown request type', name: req.get('Content-Type') });           
    }

    // check if body has files
    delete propertyObj.image;
    if( !_.isEmpty(req.files) ){
        stream.handleFile({
            files: req.files, 
            destination: config.property_image_full_destination, 
            display_path: config.property_image_display_path, 
            file_extensions: config.file_extensions
        }, function (err, imageArray) {
            if(err){
                next(err);
            }
            _update(propertyObj, req, res, next, imageArray);
        });
    } else {
        _update(propertyObj, req, res, next);
    }
};

function _update(obj,req, res, next, imageArray) {
    let unset;
    if( obj.property_for === 'rent'  ){
        delete obj.sale_price;
        
        unset = { sale_price: ""};
    } else {
        delete obj.monthly_rent; delete obj.weekly_rent; delete obj.deposit_amount; delete obj.minimum_tenancy_length; delete obj.tenancy_agreement_length; delete obj.viewing_date; delete obj.furnished;
        unset = { monthly_rent: "", weekly_rent: "", deposit_amount: "", minimum_tenancy_length: "", tenancy_agreement_length: "", viewing_date: "" , furnished: "" };
    }
    if (obj.address) {

        let coordinates = [parseFloat(obj.address.longitude), parseFloat(obj.address.latitude)];
        obj.address.loc = { type: "Point", coordinates: coordinates};         
    }    
    let updateObj = (imageArray) ? { $push: { image: { $each: imageArray } }, $set: obj, $unset: unset } : { $set: obj, $unset: unset };
    Property.update({_id: obj._id}, updateObj ,{runValidators: true, setDefaultsOnInsert: true}, function (err, success) {
        if(err) {
            return next(err);
        }
        res.json(
            response.success({
                success: true,
                message: 'Property details update successfully',
                record: success
            })
        );
    });
}

// Remove Property photos
exports.removePropertyPhoto = function(req, res, next) {
    if (_.isEmpty(req.body.image)) {
        return res.json(response.errors({
            message: 'No data received to update',
            success: false
        }));
    }
    let image = req.body.image;
    async.waterfall([
        function(done) {
            /*remove image from images list */
            Property.findOneAndUpdate({
                _id: req.params.id
            }, {
                $pull: {
                    image: {
                        name: image.name
                    }
                }
            }, {
                runValidators: true,
                setDefaultsOnInsert: true,
                fields: {
                    cover_photo: 1,
                    floor_plan: 1
                }
            }, function(err, property) {
                done(err, property);
            });
        },
        /*remove image if image saved as cover photo*/
        function(property, done) {            
            if (property.cover_photo && property.cover_photo.name === image.name) {
                /*remove image if image is set as cover photo*/
                Property.update({
                    "cover_photo.name": image.name
                }, {
                    $unset: {
                        cover_photo: ""
                    }
                }, function(err, unset) {
                    done(err, property);
                });
            } else {
                done(null, property);
            }
        },
         /*remove image if image saved as floor plan*/
        function(property, done) {  
            /*check if image name exists in floor plan list*/         
            let index = property.floor_plan.map((obj) => {
                return obj.name;
            }).indexOf(image.name);
            if (index !== -1) {
                /*if exists then remove image from floor plan list*/
                Property.update({
                    _id: req.params.id
                }, {
                    $pull: {
                        'floor_plan': {
                            name: image.name
                        }
                    }
                }, function(err, result) {
                    done(err, property);
                });
            } else {
                done(null, property);
            }
        },
        function(property, done) {
            if (image.name !== config.image_name) {
                fs.unlink(`public/${image.path}${image.name}`, function(err, success) {
                    fs.unlink(`public/${image.thumb_path}${image.thumb_name}`, function(err, success) {
                        done(null, success);
                    });
                });
            } else {
                done(null, property);
            }
        }
    ], function(err, success) {
        if (err) {
            return next(err);
        }
        res.json(response.success({
            success: true,
            message: 'Removed successfully'
        }));
    });
};

// setTimeout(()=>{

    /*mile search QUERY*/
    
    // Property.aggregate([{
    //         "$geoNear": {
    //             "near": {
    //                 "coordinates": [-0.32862769999997, 51.7452896]
    //             },
    //             "distanceField": "distance",
    //             "spherical": true,
    //             "distanceMultiplier": 0.00062137
    //         }
    //     },
    //     {
    //         "$match": {
    //             "address.loc": {
    //                 "$geoWithin": {
    //                     "$centerSphere": [
    //                         [-0.32862769999997, 51.7452896], 3 / 3963.2
    //                     ]
    //                 }
    //             }
    //         }
    //     }, 
    //     {
    //         "$project": {
    //             "address":1,
    //             "distance":1
    //         }
    //     }
    // ], (err, result) => {
    //     console.log(err || result);
    // });


    /*create new object to perform mile search */

    // Property.find({}, {
    //     "address.longitude": 1,
    //     "address.latitude": 1        
    // }, (err, result) => {
    //     result.map((r) => {
    //         var location = { type: "Point", coordinates: [parseFloat(r.address.longitude), parseFloat(r.address.latitude)] }
    //         Property.update({
    //             "_id": r._id
    //         }, {
    //             $set: {
    //                 "address.loc": location
    //             }
    //         }, (error, update) => {
    //             console.log(update);
    //         });
    //     });
    // });  





// }, 1000);


