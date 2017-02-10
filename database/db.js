var mongoose = require('mongoose');
// var dbUrl = 'mongodb://jimmy:jimmy@ds137267.mlab.com:37267/heroku_h9gm5fkw';
var dbUrl = 'mongodb://localhost/blog';

mongoose.set('debug', true);

mongoose.connect(dbUrl);
mongoose.connection.on('connected', ()=> {
	console.log("Database connected successfully");
});
mongoose.connection.on('error',()=> {
	console.log("Database connection failed");
})	
