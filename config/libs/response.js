'use strict';

function success(obj) {
	return {
		result: obj
	};
}

function error(obj){
	return {
		error: obj
	};
}

module.exports = {
	success: success,
	error: 	error
};