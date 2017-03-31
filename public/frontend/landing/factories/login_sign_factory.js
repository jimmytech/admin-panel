app
.factory('loginSignupPopup', ['$mdDialog', function ($mdDialog) {
	return {

		login: function(ev){
		    $mdDialog.show({
		      controller: "loginSignupCtrl",
		      templateUrl: 'frontend/popup/login.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true
		    })
		    .then(function(answer) {
		      // $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      // $scope.status = 'You cancelled the dialog.';
		    });
		},

		signup: function(ev){
			$mdDialog.show({
			  controller: "loginSignupCtrl",
		      templateUrl: 'frontend/popup/sign_up.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true
		    })
		    .then(function(answer) {
		      // $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      // $scope.status = 'You cancelled the dialog.';
		    });
		}
	};
}]);