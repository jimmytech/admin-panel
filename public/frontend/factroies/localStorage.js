'use strict';

app.factory('localData', [function () {
	
	return {

		token: function(){
			var token = localStorage.getItem('t');
			return token;

		}, 

		data: function(){
		var retrievedObject = JSON.parse(localStorage.getItem('user'));
		return retrievedObject;

		},

		removeItem: function(keys) {
			keys.forEach(function(key){
				localStorage.removeItem(key);
			});

		},

		setUser: function(data){			
			localStorage.setItem('user', JSON.stringify(data));
		}

	};
	
}]);