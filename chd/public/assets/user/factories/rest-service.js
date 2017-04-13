'use strict';

angular.module('app.factories')
.factory('RestSvr', ['$http', function ($http) {
	return{
		search: function (apiUrl, data, queryString) {
			var q = !angular.isUndefined(queryString) ? '?' + queryString : '';
			return $http.post((apiUrl + q), data).then(function(response){
				return (response.data.errors) ? 
				{ errors: response.data.errors }:
				{ records: response.data.data.records, paging: response.data.data.paging };
			}, function(response){
				return {
					errors: response.data.errors
				};
			});
		},
		login: function(apiUrl, data){
			return $http.post(apiUrl, data).then(function(response){
				return (response.data.errors) ? 
				{ errors: response.data.errors }:
				{ 
					result: response.data.data.success, 
					user: response.data.data.user,
					token: response.data.data.token
				};
			}, function(response){
				return {
					errors: response.data.errors
				};
			});
		},
		paginate: function(apiUrl, params, queryString, config){
			var p = !angular.isUndefined(params) ? params : '';
			var q = !angular.isUndefined(queryString) ? '?' + queryString : '';
			return $http.get((apiUrl + p + q), config).then(function(response){
				return (response.data.errors) ? 
				{ errors: response.data.errors }:
				{
					records: response.data.data.records,
					paging: response.data.data.paging,
					group: response.data.data.group,
				};
			});
		},
		get: function(apiUrl, params){
			var p = !angular.isUndefined(params) ? params : null;
			return $http.get(apiUrl, p).then(function(response){
				return {
					record: response.data.data.record
				};
			});
		},
		getById: function(apiUrl, id){
			return $http.get(apiUrl + id).then(function(response){
				return {
					record: response.data
				};
			});	
		},
		post: function(apiUrl, data){
			return $http.post(apiUrl, data).then(function(response){
				return (response.data.errors) ? 
				{ errors: response.data.errors }:
				{
					result: response.data.data.success, 
					message: response.data.data.message, 
					data: response.data.data.record
				};
			}, function(response){
				return {
					errors: response.data.errors
				};
			});
		},
		put: function(apiUrl, id, data, config){
			var c = !angular.isUndefined(config) ? config : null;
			return $http.put((apiUrl + id), data, c).then(function(response){
				return (response.data.errors) ? 
				{ errors: response.data.errors }:
				{
					result: response.data.data.success, 
					message: response.data.data.message, 
					data: response.data.data.record
				};
			}, function(response){
				return {
					errors: response.data.errors
				};
			});
		},
		delete: function(apiUrl, id){
			return $http.delete(apiUrl + id).then(function(response){
				return (response.data.errors) ? 
				{ errors: response.data.errors }:
				{
					message: response.data.data.message,
					result: response.data.data.success
				};
			}, function(response){
				return {
					errors: response.data.errors
				};
			});	
		}
	};
}]);