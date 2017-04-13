const path			= require('path'),
	csvtojson 		=require('csvtojson'), 
	suburbModel		= require(path.resolve('./modules/backend/models/suburb_model'));

// function createSubrub(){

// 	let suburbArray = [];

// 	suburbModel.find({}, {_id:1}, (err, result) => {

// 		if (result.length === 0) {

// 			csvtojson()
// 			.fromFile(path.resolve('./modules/backend/csv/Australian_Post_Codes_Lat_Lon.csv'))
// 			.on('json',(jsonObj)=>{
// 				suburbArray.push(jsonObj);				
// 			})
// 			.on('done',(error)=>{
// 			    suburbModel.collection.insertMany(suburbArray, {
// 			    	ordered: false
// 			    }, (err, result) => {
// 			    	console.log(err||result);
// 			    });

// 			});

// 		}else{
// 			console.log("Suburb already here");
// 		}
// 	});
	
// }

// createSubrub();


exports.suburbList = (req, res) => {

	suburbModel.distinct('suburb', 

		{

           "state": req.query.state	

        }, (err, result) => {

		res.json({
			success: true,
			data: result
		});

	});  

};

