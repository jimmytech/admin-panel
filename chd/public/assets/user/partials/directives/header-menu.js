'use strict';
angular.module('app.directives')

.directive('headerMenu', ['$location', 'CommanSrv', '$rootScope', function($location, CommanSrv, $rootScope){
	return {
		restrict: 'A',		
		templateUrl: 'assets/user/partials/directives/templates/main-header-menu.html',
		link: function(scope){			
	        scope.$watch('user', function(){
	              scope.headerMenu = CommanSrv.navbarLinks();
	         }); 				
		}
	};
}]);