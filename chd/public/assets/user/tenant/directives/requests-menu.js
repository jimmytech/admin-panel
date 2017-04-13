'use strict';

angular.module('app.directives')
.directive('requestMenu', ['$location', '$rootScope', 'CommanSrv', function ($location, $rootScope, CommanSrv) {
	return {
		restrict: 'A',
		scope: {
			userRequestMenu: '='
		},	
		templateUrl: 'assets/user/tenant/directives/templates/request-menu-link.html',

		link: function(scope) {
				var	userRequestMenu = CommanSrv.requestMenuLinks();
				scope.userRequest = userRequestMenu;
				scope.currentRequestPath = $location.path();								
		}
	};
}]);