'use strict';
// module is looked up internally and returned to the caller
angular.module('app.controllers')
.controller('authCtrl', ['$scope', 'RestSvr', 'StaticSvr','toastService', '$location', 'localStorageService', '$rootScope','$routeParams', 'AuthSrv',
	function($scope, RestSvr, StaticSvr,toastService, $location, localStorageService, $rootScope, $routeParams,AuthSrv){

	/* Define roles for users */
	$scope.roles = StaticSvr.getUserRoles();
	var queryString = $location.search();
	if( queryString ) {
		$scope.emailVerified = queryString.emailVerified === 'true' ? true : false;
	}

	/* Register a new user */
	$scope.register = function(isValid){
		if(!isValid){
			return;
		}
		RestSvr.post('/register', $scope.user).then(function(response){
			if(response.errors){
				toastService.alert({message: response.errors.email.message || response.errors.message, class: 'error'});
			} else {
				$scope.result = response.result;	
			}
		});
	};
	
	// Login a user
	$scope.login = function(isValid){
		if(!isValid) {
			return;
		}	
		var customStorageType = $scope.staySigned ? 'localStorage' :'localStorage';
		localStorageService.set('staySignedIn',customStorageType, 'localStorage');
		localStorageService.setStorageType(customStorageType);
		RestSvr.login('/login', $scope.user).then(function(response){
			if(response.errors){
				toastService.alert({message: response.errors.message, class: 'error'});
			}
			if(response.token && response.user){
				/*if anything prevoiusly in locastorage remove it*/
				localStorageService.remove('token', 'localStorage');
				localStorageService.remove('token', 'sessionStorage');
				localStorageService.remove('user', 'localStorage');
				localStorageService.remove('user', 'sessionStorage');
				localStorageService.set('token', response.token, customStorageType);
				localStorageService.set('user', response.user, customStorageType);
				AuthSrv.isLogged = true;
				$rootScope.user = localStorageService.get('user', customStorageType);
				if( ['/property-search-listing'].indexOf($rootScope.previousPath) !== -1){
					$location.path($rootScope.previousPath);		
				} else {
					$location.path('/my-cherrydoor/details');		
				}
				
				$location.search('');
			}
			
		});
	};

	// forgot password
	$scope.result = false;
	$scope.forgot = function(isValid){
		if(!isValid){
			return;
		}

		RestSvr.post('/forgot', $scope.user).then(function(response){
			if(response.errors){
				toastService.alert({message: response.errors.message, class: 'error'});
			} else {
				$scope.result = response.result;
				$scope.message = response.message;
			}
		});
	};

	$scope.reset = function(isValid){
		if(!isValid) {
			return;
		}
		if( $scope.new_password !==  $scope.confirm_password){
			toastService.alert({message: 'Password don\'t match', class: 'error'});	
			return;
		}
		var token = ($routeParams.token).trim();
		RestSvr.put('/reset/', $routeParams.token, {password: $scope.new_password}).then(function(response){
			if(response.errors){
				toastService.alert({message: response.errors.message, class: 'error'});
			}else {
				toastService.alert({message: response.message, class: 'success'});
				$location.path('/login');
			}
		});
	};
}]);