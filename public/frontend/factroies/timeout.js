'use strict';

app.factory('timeout', ['$timeout', function ($timeout) {
	return {
		fiveHundredMiliSecond: function(cb){
					$timeout(function(){
						cb();
					}, 500);
		}
	}
}]);