'use strict';

angular.module('app.directives')
.directive('setUrl', ['$location', function($location){
	return {
		restrict: 'A',
		transclude: false,
		link: function(scope, elem, attrs){
			var url = attrs.setUrl;
			if (!$location.$$html5) {
				elem.attr('href','#' + url);
			} else {
				elem.attr('href', '#' + url);	
			}
		}
	};
}])
.directive('userMenu', [function(){
	return {
		restrict: 'A',
		scope: {
			userMenu: '=',
			clearToken: "&"
		},
		templateUrl: 'assets/user/directives/templates/user-menu.html',
		link: function(scope){
			var userMenu = [{
				icon: 'star_rate', 
				text: 'Saved Properties'
			},{
				icon: 'home',
				url: '/property-room-details',
				text: 'My Property'
			}, {
				icon: 'notifications',
				text: 'Saved Searches & Alerts'
			}, {
				icon: 'person',
				text: 'My Profile'
			}, {
				icon: 'settings',
				text: 'Account Settings'
			}];
			scope.list = userMenu;
		}
	};
}])

.directive('profileMenu', ['$location', '$rootScope', 'CommanSrv',
	function($location, $rootScope, CommanSrv){
	return {
		restrict: 'A',
		scope: {
			userProfileMenu: '='
		},
		templateUrl: 'assets/user/directives/templates/profile-menu-link.html',
		link: function(scope){
			var userProfileMenu = CommanSrv.profileMenuLinks();
			var locationPath = $location.path().split("/");
			scope.list = userProfileMenu;
			scope.profileMenu = $location.path();
			 if (locationPath[1] === "my-cherrydoor" && locationPath[2] === "details") {
			 	scope.profileMenu = "/my-cherrydoor/details";	
			 }			 
			 if (locationPath[1] === "my-cherrydoor" && locationPath[2] === "requests") {
			 	scope.profileMenu = userProfileMenu[0].url;	
			 }						
		}
	};
}])	

.directive('passwordVerify', ['$location', function($location){
	return {
		require: "ngModel",
		scope: {
			passwordVerify: '='
		},
		link: function(scope, element, attrs, ctrl) {
			scope.$watch(function() {
				var combined;

				if (scope.passwordVerify || ctrl.$viewValue) {
					combined = scope.passwordVerify + '_' + ctrl.$viewValue; 
				}                    
				return combined;
			}, function(value) {
				if (value) {
					ctrl.$parsers.unshift(function(viewValue) {
						var origin = scope.passwordVerify;
						if (origin !== viewValue) {
							ctrl.$setValidity("passwordVerify", false);
							return undefined;
						} else {
							ctrl.$setValidity("passwordVerify", true);
							return viewValue;
						}
					});
				}
			});
		}
	};
}]);
	