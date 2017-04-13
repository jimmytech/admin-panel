'use strict';

/* jshint -W078 */

const path 					 =require('path'),
	 blogModel               = require(path.resolve('./modules/backend/models/blog_model'));

exports.test = (req, res) => {
	blogModel.findById("58aa8815f3f01a2030300d42", (err, result)=>{
		res.json({
			success: true,
			result: result
		});
	});
};
