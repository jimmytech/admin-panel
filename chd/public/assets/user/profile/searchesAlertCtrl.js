'use strict';

angular.module('app.controllers')
.controller('alertSearchesCtrl', ['$scope', 'RestSvr', 'dialogService', '$rootScope', 'toastService', 'localStorageService','$location','SearchHistory',
    function ($scope, RestSvr, dialogService, $rootScope, toastService, localStorageService, $location, SearchHistory) {
    	function load(query) {
            var queryString = (query !== undefined) ? query : '';
    		RestSvr.get('save_search/' + $rootScope.user._id + queryString).then(function (response) {
    			if(response.errors){
    				toastService.alert({message: response.errors.message, class: 'error'});
    			} else {
    				$scope.searchAlerts = (response.record) ? response.record.user : [];
                    $scope.property_for_counts = (response.record) ? response.record.counts : [];
    			}
    		});	
    	}
    	
    	// On page load
    	load();

    	// Delete this search
    	$scope.delete = function (index, event) {
    		var id = $scope.searchAlerts[index].save_searches._id;
    		dialogService.confirm({ text: 'Are you sure want to delete this search from saved list ?', ok: 'Delete' },event)
            .then(function(result) {
                /* user has pressed cancel button */
            }, function(ok){
	    		RestSvr.delete('save_search/', id + '/' + $rootScope.user._id).then(function (response) {
	    			if(response.errors){
	    				toastService.alert({message: response.errors.message, class: 'error'});
	    			} else {
	    				load();
	    				//toastService.alert({message: response.message, class: 'success'});
	    			}
	    		});
	    	});	
    	};

    	// search address
    	$scope.search_this_address = function (index) {
    		var search_filters = $scope.searchAlerts[index].save_searches.filters;
    		$location.path('property-search-listing').search('q', angular.toJson(search_filters));
    	};

        $scope.search_history = localStorageService.get('homePageSearch', 'localStorage');

        // search from history
        $scope.search_history_address = function (index) {
            var search_filters = $scope.search_history[index];
            $location.path('property-search-listing').search('q', angular.toJson(search_filters));
        };

        // remove from history    	
    	$scope.remove_history = function (index) {
    		$scope.search_history.splice(index, 1);
            localStorageService.set('homePageSearch', $scope.search_history, 'localStorage');
    	};

        // set the alert
        $scope.setAlerts = function (index) {
             var search_filters = $scope.search_history[index];
            $location.path('save-search').search('q', angular.toJson(search_filters));
        };

        $scope.clear_all_search_history = function () {
            $scope.search_history = [];
            localStorageService.set('homePageSearch', $scope.search_history, 'localStorage');
        };

        $scope.toggleAlert = function (index) {
            var alerts = $scope.searchAlerts[index].save_searches;
            var frequencySwitcher = { 'monthly': 'noalert','immediately': 'noalert','weekly': 'noalert','daily': 'noalert', 'noalert': 'daily' };
            
            RestSvr.put('toggle_search_alert/', $rootScope.user._id, {_id: alerts._id, frequency: frequencySwitcher[alerts.frequency]}).then(function (response) {
                if(response.errors){
                    toastService.alert({message: response.errors.message, class: 'error'});
                } else {
                    load();
                    toastService.alert({message: response.message, class: 'success'});
                }
            });
        };

        $scope.filterProperty = function (property_for) {
            $scope.property_for_filter = 'for ' + property_for;
            load('?property_for='+property_for);
        };
    }
]);    