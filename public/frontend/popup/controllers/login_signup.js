'use strict';

app.controller('loginSignupCtrl', ['http', 'toastyService', 'loginSignupPopup', '$mdDialog', '$scope', '$location', '$rootScope', '$http',
	function(http, toastyService, loginSignupPopup, $mdDialog, $scope, $location, $rootScope, $http) {



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

		$scope.login = function(){

			http.login('/user-login', $scope.userLogin).then(function(response){
				
				if (response.result === true) {

					localStorage.setItem('t', response.token);
					localStorage.setItem('user', JSON.stringify(response.user));
					
					$scope.closeMe();
					$location.path('/my-profile');

				}else{
					toastyService.notification(response.result, response.message);
				}

			});
		};



		/*close dialog*/
		$scope.closeMe = function(){
			$mdDialog.hide();
		};			
	
}]);