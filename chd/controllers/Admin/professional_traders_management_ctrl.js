'use strict';

const	path     	 			= require('path'),
		user                    = require(path.resolve('./models/User')),
 		config 		 			= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
		property     			= require(path.resolve('./models/Property'));

exports.serviceRequestList = (req, res)=>{
	console.log("hello serviceRequestList");
};	

// setTimeout(function(){
//    var i;
//     var tel = {
//         telephone:"7042752172"
//     };
//  for(i=0; i<20;i++){
//     var add ={
//          address1: 'address1address1address1address1address1address1'+i,
//          address2: 'address1address1address1address1address1address1'+i,
//          city: "city city city city1"+ i,
//          state: "state state state state1"+ i,
//          postcode: "110096"+ i
//     };            
//      var obj = {
//          firstname: 'Jitendra',
//          lastname : 'subadmin',            
//          email: 'professional'+i+'@traders.com',
//         address: add,            
//          password: '123456',
//          role: 'professionalTrader', 
//          auth:crypto.randomBytes(10).toString('hex'),         
//          phone: tel,
			// company: Flexsin+i,
			// visiting_charge: i 
//      };
//      var data = new Admin(obj);
//      data.save(function(err, result){
//          console.log(err||result);
//      });
//  }
// });	