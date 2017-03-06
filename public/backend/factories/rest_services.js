app.factory('http', ['$http', function ($http) {
	return {
		get: function(url, data){
			return $http.get(url, data).then(function(response){
				return response.data;
			});				
		},
		post: function(url, data){
			return $http.post(url, data).then(function(response){
				return {
					result: response.data
				};
			}, function(response){
				return {
					error: response.data
				};
			});
		},
		put: function(){

		},
		delete: function(url){
			return $http.delete(url).then(function(response){
				return {
					result: response.data
				};
			});			
		}
	};
}]);