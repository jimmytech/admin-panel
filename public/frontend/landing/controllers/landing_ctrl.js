'use strict';

app.controller('landingCtrl', ['$scope', '$location', '$rootScope', '$http', 
	function($scope, $location, $rootScope, $http) {
		(function(){
			init();
		}());

		function init() {
			$http.get('/test-function').then(function(response){
				$scope.data = response.data.result;
			});
		}

}]);