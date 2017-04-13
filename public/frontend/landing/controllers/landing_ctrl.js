'use strict';

app.controller('landingCtrl', ['loginSignupPopup','$scope', '$location', '$rootScope', '$http', '$mdDialog',
	function(loginSignupPopup, $scope, $location, $rootScope, $http, $mdDialog) {

		$scope.toggleAdvanceSearch = function  () {
			$(".listing-srchTop").css("display", "none");
			$(".advancesrchBx").css("display", "block");
		};
		$scope.hideAdvanceSearch = function  () {
			$(".advancesrchBx").css("display", "none");
			$(".listing-srchTop").css("display", "block");	 
		};

		$scope.loginPopup = function  (ev) {
			loginSignupPopup.login(ev);
		};

		$scope.signUpPopup = function  (ev) {
			loginSignupPopup.signup(ev);
		};
}]);