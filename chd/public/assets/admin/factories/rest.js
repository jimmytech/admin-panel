'use strict';

app.factory('RestSvr', ['$http', function ($http) {
	return{
		paginate: function(apiUrl, params, queryString, config){
			var p = !angular.isUndefined(params) ? params : '';
			var q = !angular.isUndefined(queryString) ? '?' + queryString : '';
			return $http.get((apiUrl + p + q), config).then(function(response){
				return {
					records: response.data.records,
					paging: response.data.paging,
					group: response.data.group,
				};
			});
		},
		get: function(apiUrl, params){
			var params = !angular.isUndefined(params) ? params : null;
			return $http.get(apiUrl, params).then(function(response){
				return {
					record: response.data.record
				};
			}, function(response){
				return {
					errors: response.data.errors
				};
			});
		},
		
		getById: function(apiUrl, id){
			return $http.get(apiUrl).then(function(response){
				return {
					result: response.data.success, 
					message: response.data.msg, 
					data: response.data.record
				};
			}, function(response){
				return {
					result: response.data.success, 
					message: response.data.msg
				};
			});	
		},

		post: function(apiUrl, data){
			return $http.post(apiUrl, data).then(function(response){
				return {
					result: response.data.success, 
					message: response.data.msg, 
					data: response.data.record
				};
			}, function(response){
				return {
					result: response.data.success, 
					message: response.data.msg 					
				};
			});
		},
		put: function(apiUrl, id, data){
			return $http.put((apiUrl + id), data).then(function(response){
				return {
					result: response.data.success, 
					message: response.data.msg, 
					data: response.data.record
				};
			}, function(response){
				return {
					errors: response.data.success, 
					message: response.data.msg 	
				};
			});
		},
		delete: function(apiUrl){
			return $http.delete(apiUrl).then(function(response){
				return {
					result: response.data.success, 
					message: response.data.msg, 
					data: response.data.record
				};
			}, function(response){
				return {
					errors: response.data.success, 
					message: response.data.msg 	
				};
			});	
		}
	};
}]);