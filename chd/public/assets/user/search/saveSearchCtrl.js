'use strict';

angular.module('app.controllers')
.controller('saveSearchCtrl', ['$scope', '$location', 'localStorageService','RestSvr','toastService', '$rootScope','PropertySvr','$filter',
	function($scope, $location, localStorageService, RestSvr, toastService, $rootScope, PropertySvr, $filter){
		var search = $location.search();
		var save_this_search = (search) ? angular.fromJson(search.q) : [];
		if( !save_this_search ){
			$location.path('/');
			toastService.alert({message: 'No search to save', class: 'error'});
			return;
		}

		// #If Min or Max beds available
		var beds = [], display_beds;
		if( save_this_search.min_beds && save_this_search.max_beds && save_this_search.min_beds !== 'any' && save_this_search.max_beds !== 'any'){
			beds = ['with ', (save_this_search.min_beds === '0' ? 'Studio':save_this_search.min_beds), ' to ', (save_this_search.max_beds === '0' ? 'Studio':save_this_search.max_beds), ' bedrooms'];
		} else if( save_this_search.min_beds && save_this_search.min_beds !== 'any' ){
			beds = ['with ', (save_this_search.min_beds === '0' ? 'Studio':save_this_search.min_beds + '+'), ' bedrooms'];
		} else if( save_this_search.max_beds && save_this_search.max_beds !== 'any' ){
			beds = ['with ', (save_this_search.max_beds === '0' ? 'Studio':save_this_search.max_beds + '+'), ' bedrooms'];
		}
		display_beds = beds.length > 0 ? beds.join('') : undefined;

		// #If sale price is available
		var price = [], display_price;
		if( save_this_search.min_sale_price && save_this_search.max_sale_price && save_this_search.min_sale_price !== 'any' && save_this_search.max_sale_price !== 'any'){
			price = ['between ', $filter('currency')(save_this_search.min_sale_price, "£",0), ' and ',$filter('currency')(save_this_search.max_sale_price, "£",0)];
		} else if(save_this_search.min_sale_price && save_this_search.min_sale_price !== 'any'){
			price = ['greater than ', $filter('currency')(save_this_search.min_sale_price, "£",0)];
		} else if(save_this_search.max_sale_price && save_this_search.max_sale_price !== 'any'){
			price = ['less than ', $filter('currency')(save_this_search.max_sale_price, "£",0)];
		}

		// #If rent price is available
		if( save_this_search.min_price_per_month && save_this_search.max_price_per_month && save_this_search.min_price_per_month !== 'any' && save_this_search.max_price_per_month !== 'any'){
			price = ['between ', $filter('currency')(save_this_search.min_price_per_month, "£",0), $filter('currency')(save_this_search.max_price_per_month, "£",0)];
		} else if(save_this_search.min_price_per_month && save_this_search.min_price_per_month !== 'any'){
			price = ['greater than ', $filter('currency')(save_this_search.min_price_per_month, "£",0)];
		} else if(save_this_search.max_price_per_month && save_this_search.max_price_per_month !== 'any'){
			price = ['less than ', $filter('currency')(save_this_search.max_price_per_month, "£",0)];
		}
		display_price = price.length > 0 ? price.join('') : undefined;
		
		// Now make the search address prettier
		$scope.pretty_search_address = [
		(save_this_search.property_type ? (save_this_search.property_type.name + ' for ') : 'Property for '),
		(save_this_search.property_for), ' in ', 
		(save_this_search.search_address || 'UK '), 
		(display_beds), 
		(display_price)].join('');

		$scope.createAlert = function (isValid) {
			if(!isValid){
				return;
			}

			var alert = Object.assign($scope.alert, {'prettyAddress':$scope.pretty_search_address,'filters': save_this_search, 'channel': save_this_search.property_for});
			RestSvr.put('save_search/', $rootScope.user._id, alert).then(function (response) {
				if(response.errors){
					toastService.alert({message: response.errors.message, class: 'error'});
				} else {
					$location.path('/my-cherrydoor/alerts-searches');
					toastService.alert({message: response.message, class: 'success'});
				}
			});
		};

		$scope.goBack = function () {
			$location.path('property-search-listing').search('q', angular.toJson(save_this_search));
		};
	}
]);