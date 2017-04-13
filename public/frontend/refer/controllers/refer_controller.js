'use strict';

app.controller('referCtrl', ['$scope', 'http', 'toastyService',
	function ($scope, http, toastyService) {


		$scope.referToFriend = function(){

			$scope.buttonStatus = true;
			http.get('/refer-to-friend/'+$scope.friend.email).then(function(response){

				toastyService.notification(response.record.success, response.record.message);
				$scope.buttonStatus = false;
				
				if (response.record.success) {
					$scope.friend = {};
					$scope.referringForm.$setPristine();
					$scope.referringForm.$setUntouched();
				}
			});
			
		};
	}]);