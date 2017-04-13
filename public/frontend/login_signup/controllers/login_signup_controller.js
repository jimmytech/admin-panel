'use strict';

app.controller('loginSignUpCtrl', ['$cookies', 'http', 'toastyService', 'loginSignupPopup', '$mdDialog', '$scope', '$location', '$rootScope', '$http',
	function($cookies, http, toastyService, loginSignupPopup, $mdDialog, $scope, $location, $rootScope, $http) {

		$scope.showscrollbar=true;
		(function(){

			if ($cookies.get('userLoginCredentials')) {
				$scope.userLogin = JSON.parse($cookies.get('userLoginCredentials'));
				$scope.rememberMeStatus = true;
			}

		}());


		$scope.userSignInfo = {"country_code": "+61"};
		$scope.dobMaxDate = new Date();

		/*login sign popup*/
		$scope.loginSignup = function(ev, type){
			if (type == 'login') {
				
				loginSignupPopup.login(ev);
			}else if(type == 'signup'){
				loginSignupPopup.signup(ev);
			}
		};

		$scope.signUp = function(){

			if ($scope.userSignInfo.password !== $scope.userSignInfo.cpassword) {
				toastyService.notification(false, "Password and confirm password is not equal");
			} else if (!$scope.userSignInfo.is_agree) {
				toastyService.notification(false, "Please accept terms and conditions.");
			} else {
				http.post('/user-signup', $scope.userSignInfo).then(function(response){
						toastyService.notification(response.result, response.message);
					if (response.result) {
						$scope.closeMe();
					}
				});
			}

		};

		// $scope.login = function(){

		// 	http.login('/user-login', $scope.userLogin).then(function(response){
				
		// 		if (response.result === true) {

		// 			localStorage.setItem('userToken', response.token);
		// 			localStorage.setItem('user', JSON.stringify(response.user));
					
		// 			$scope.closeMe();
		// 			$location.path('/my-profile');

		// 		}else{
		// 			toastyService.notification(response.result, response.message);
		// 		}

		// 	});
			
		// };



		/*close dialog*/
		$scope.closeMe = function(){
			$mdDialog.hide();
		};	


		$scope.rememberMe = function(){

			if ($scope.rememberMeStatus) {
				$cookies.put("userLoginCredentials", JSON.stringify($scope.userLogin));
			}else{
				$cookies.remove('userLoginCredentials');
			}

		};		
	
}]);