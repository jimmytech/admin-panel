'use strict';


angular.module('app.directives')
.directive('pwCheck', [function () {
    return {
    	require: 'ngModel',
    	scope: {
    		pwCheck:'='
    	},
     	link: function (scope, elem, attrs, ctrl) {
        	var firstPassword = '#' + attrs.pwCheck;
            
        	elem.add(firstPassword).on('keyup', function () {
        		scope.$apply(function () {
        			// match password and its confirm password
        			var v = elem.val() === scope.pwCheck;
        			ctrl.$setValidity('pwmatch', v);
        		});
        	});	
    	}
    };
}]);