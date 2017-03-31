'use strict';

app
.factory('http', ['$http', function ($http) {

	return {

		get: function(apiUrl, params){
			// var p = !angular.isUndefined(params) ? params : null;
			return $http.get(apiUrl).then(function(response){
				return {
					record: response.data
				};
			});
		},

		post: function(url, data){

			return $http.post(url, data).then(function(response){

				return {
					result: response.data.success, 
					message: response.data.message, 
					data: response.data.record
				};

			}, function(response){

				return {
					message: response.data.errors
				};
				
			});

		},

		login: function(url, data){

			return $http.post(url, data).then(function(response){

				return {

					result: response.data.success, 
					message: response.data.message, 
					token: response.data.token,
					user: response.data.user
					
				};

			}, function(response){

				return {
					message: response.data.errors
				};
				
			});

		},		

		put: function(){

		},

		delete: function(){

		}

	};

}]);