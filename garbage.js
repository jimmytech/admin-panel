// if(process.env.NODE_ENV === 'production'){
// 	app.use((err, req, res, next) => {

// 		if(err){
// 			res.status(err.status || 500).json({
// 				errors: {
// 					source: err,
// 					message: 'Some error occurred, see log for more info!!',
// 					success: false
// 				}	
// 			});
// 			logger.log('error', err);		
// 		}
// 		next();
// 	});	
// } else if(process.env.NODE_ENV === 'test'){
// 	app.use((err, req, res, next) => {
// 		if(err){
// 			res.status(500).send(err);
// 		}
// 		next();
// 	});
// }  else {
// 	app.use((err, req, res, next) => {
// 		if(err){
// 			res.status(err.status || 500).json({
// 				errors: {
// 					source: err,
// 					code: err.code,
// 					message: err.message || 'Some error occurred, see log for more info!!',
// 					success: false
// 				}	
// 			});
// 			logger.log('error', err);		
// 		}
// 		next();
// 	});	
// }


// exports.first = (req, res) => {
	
// 	setTimeout(()=>{
// 		res.json({
// 			success: true
// 		});		
// 	}, 9000);
// };

// exports.second = (req, res) => {
// 	setTimeout(()=>{
// 		res.json({
// 			success: true
// 		});		
// 	}, 5000);
// };
// exports.third = (req, res) => {
// 	setTimeout(()=>{
// 		res.json({
// 			success: true
// 		});		
// 	}, 2000);
// };