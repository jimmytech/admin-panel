"use strict";
app.controller('mailActivitiesCtrl', ['$scope', '$http', '$rootScope', '$location', 'AlertService', 'RestSvr',
	function($scope, $http, $rootScope, $location, AlertService, RestSvr) {
		$scope.icons = {
			'bounce': 'bubble_chart',
			'deferred': 'schedule',
			'processed': 'settings',
			'dropped' : 'priority_high',
			'delivered': 'check_box'
		};
		$scope.forceEllipses = true;
		$scope.maxSize = 10;
		$scope.paging = { page: 1 };
		$scope.spinner = true;

		var load = function (isCache, sortBy, queryEmail) {
			var sort = !angular.isUndefined(sortBy)? '&sort=' + sortBy : '';
			var qEmail = !angular.isUndefined(queryEmail)? '&email=' + queryEmail : '';
			RestSvr.paginate('emails_list','','page=' + $scope.paging.page + qEmail + sort, {cache: isCache}).then(function(response){
				$scope.spinner = false;
				if(response.errors){
					AlertService.alert({message: response.errors.message, class: 'danger'});
				}
				else
				{
					$scope.emails = response.records;
					$scope.paging = response.paging;
				}
			});
		};
		load(true);

		$scope.pageChanged = function() {
			load(false);
		};

		$scope.searchMailQueue = function (searchText) {
			load(false, undefined, searchText);
		};
	}
]);