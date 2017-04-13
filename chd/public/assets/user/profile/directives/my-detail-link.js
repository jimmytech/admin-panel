'use strict';

angular.module('app.directives')
.directive('myDetail', ['$location', 'CommanSrv', function($location, CommanSrv) {
    return {
		restrict: 'A',
		scope: {
			userAccountMenu: '='
		},
		templateUrl: 'assets/user/profile/directives/templates/my-detail-menu.html',
		link: function(scope){			
			var userAccountMenu = CommanSrv.myDetailLinks();
			scope.menu = userAccountMenu;
			scope.path = $location.path();
		}
	};
}]);