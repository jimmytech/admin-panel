'use strict';

app.controller('settingsCtrl', ['$scope', 'http', 'localData', 'toastyService',
	function ($scope, http, localData, toastyService) {

	(function(){


		$scope.profileInfo = localData.data();
		$scope.active = {isActive: $scope.profileInfo.isActive};
		$scope.notification = {enableNotification: $scope.profileInfo.enableNotification};

	}());

	/*change user password*/
	$scope.changePassword = function(){


		$scope.userPassword._id = $scope.profileInfo._id;

		http.post('/change-password', $scope.userPassword).then(function(response){
			toastyService.notification(response.result, response.message);

			if (response.result) {
				$scope.userPassword = {};
				$scope.changePasswordForm.$setPristine();
				$scope.changePasswordForm.$setUntouched();
			}
		});
	};

	$scope.activeInactive = function(){

		$scope.active._id = $scope.profileInfo._id;

		http.post('/is-active', $scope.active).then(function(response){
			toastyService.notification(response.result, response.message);
			$scope.profileInfo.isActive = $scope.active.isActive;
			
			/*update localstorage with updated state*/
			localData.setUser($scope.profileInfo);
		});
		
	};

	$scope.activeInactiveNotification = function(){

		$scope.notification._id = $scope.profileInfo._id;
		http.post('/notification-setting', $scope.notification).then(function(response){
			toastyService.notification(response.result, response.message);

			$scope.profileInfo.enableNotification = $scope.notification.enableNotification;
			
			/*update localstorage with updated state*/
			localData.setUser($scope.profileInfo);			
		});

	};
	
}]);