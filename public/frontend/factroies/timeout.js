'use strict';

app.factory('timeout', ['$timeout', function ($timeout) {
	return {
		sixHundredMiliSecond: function(cb){
					$timeout(function(){
						cb();
					}, 600);
		}
	}
}]);