'use strict';

angular.module('app.filters')
.filter('indexOf', function() {
   
	return function(array, value) {
		if(!angular.isArray(array)){
			return -1;
		}
		var a = array.map(function(e) {
			return e.property_id;
		}).indexOf(value);
		return a;
  	};
});