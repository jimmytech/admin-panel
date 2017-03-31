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



// class baseModel {

//   	constructor(options = {}, data = []) { // class constructor
//         this.name = 'Base'
//     	this.url = 'http://azat.co/api'
//         this.data = data
//     	this.options = options
//     }

//     getName() { // class method
//         console.log(`Class name: ${this.name}`)
//     }

// }


// class AccountModel extends baseModel {

//     constructor(options, data) {

//     super({private: true}, ['32113123123', '524214691']) //call the parent method with super
//         this.name = 'Account Model'
//     	this.url +='/accounts/'
//     }

//     get accountsData() { //calculated attribute getter
//     // ... make XHR
//         return this.data
//     }
// }      

// let accounts = new AccountModel()
// accounts.getName()
// console.log('Data is %s', accounts.accountsData)  	


