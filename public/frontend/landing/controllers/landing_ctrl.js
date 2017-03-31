'use strict';

app.controller('landingCtrl', ['loginSignupPopup','$scope', '$location', '$rootScope', '$http', '$mdDialog',
	function(loginSignupPopup, $scope, $location, $rootScope, $http, $mdDialog) {

		$scope.loginPopup = function  (ev) {
			loginSignupPopup.login(ev);
		};

		$scope.signUpPopup = function  (ev) {
			loginSignupPopup.signup(ev);
		};
}]);