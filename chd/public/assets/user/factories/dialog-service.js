/*
* @ source 
* https://material.angularjs.org/latest/demo/dialog
*/
'use strict';

angular.module('app.factories')
.factory('dialogService', ['$mdDialog',function ($mdDialog) {
	  return {
	  	confirm: function(obj,ev){
			var confirm =  $mdDialog.confirm()
	          .title('Confirmation Message')
	          .textContent(obj.text)
	          .ariaLabel('confirmation_dialog')
	          .targetEvent(ev)
	          .ok('Cancel')
	          .cancel(obj.ok);

			return $mdDialog.show(confirm); 
	  	}
	};
}]);