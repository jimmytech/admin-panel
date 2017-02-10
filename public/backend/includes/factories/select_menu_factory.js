'use strict';

app.factory('selectLeftPanelService', ['$location', function ($location) {
		return {
			selectMe: function(){
				alert("alert");
			}
		};
}]);