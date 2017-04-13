'use strict';

angular.module('app.factories')
.factory('SearchHistory', ['localStorageService', function (localStorageService) {
	const HISTORY_LENGTH = 5, STORAGE_TYPE = 'localStorage';
	var self = this;
	return{
		set: function (key) {
			self.key = key;
			self.search_history = this.get(key) || [];
		},
		get: function (key) {
			return localStorageService.get(key, STORAGE_TYPE);
		},
		add: function (key, data) {
			// Set the storage first
			this.set(key);
			var copyData = angular.copy(data);
			
			if( self.search_history.length > HISTORY_LENGTH ){
				self.search_history.pop();	
			} else {
				if(!this.isUnique(copyData)){
					self.search_history.unshift(copyData);
				}
			}
			localStorageService.set(self.key, self.search_history, STORAGE_TYPE);
		},
		remove: function (index) {
			self.search_history.splice(index, 1);
			localStorageService.set(self.key, self.search_history, STORAGE_TYPE);
		},
		isUnique: function (object) {
			return self.search_history.some(function (value) {
				return angular.equals(value, object);
			});
		}
	};
}]);