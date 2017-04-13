'use strict';

angular.module('app.factories')
.factory('StaticSvr', function () {
	return{
		getUserRoles: function(){
			return [
				{ value: 'tenant1', text: 'I am a first time buyer' },
				{ value: 'tenant2', text: 'I am a buyer (not first time)' },
				{ value: 'tenant', text: 'I am looking to rent'},
				{ value: 'landlord', text: 'I am a landlord' },
				// { value: 'estateAgent', text: 'I am an Estate Agent'}, On client request
				{ value: 'tenant3', text: 'Other'}
			];
		}
	};
});