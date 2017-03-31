'use strict';

app.controller('referCtrl', ['$scope', 'http',
	function ($scope, http) {


		$scope.referToFriend = function(){
			$scope.buttonStatus = true;
			http.get('/refer-to-friend/'+$scope.friend.email).then(function(response){
				console.log(response);
				$scope.buttonStatus = false;
			});
			
		};
	}]);