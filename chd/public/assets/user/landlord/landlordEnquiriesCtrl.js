'use strict';

angular.module('app.controllers')
.controller('landlordEnquiriesCtrl', ['$scope', '$location', 'localStorageService','RestSvr','$rootScope','toastService','dialogService','$timeout','$mdDialog',
	function($scope, $location, localStorageService, RestSvr, $rootScope, toastService, dialogService, $timeout, $mdDialog){
		$scope.forceEllipses = true;
		$scope.maxSize = 10;
		$scope.paging = { page: 1 };
		$scope.spinner = true;
		function loadEnquiries(sortBy, page) {
			var sort = !angular.isUndefined(sortBy)? '&sort=' + sortBy : '';
			RestSvr.paginate('enquiry/', $rootScope.user._id, 'page=' + $scope.paging.page + sort).then(function (response) {
				if(response.errors){
					toastService.alert({ message: response.errors.message, class: 'error' });
				} else {
					$scope.paging = response.paging;
					$scope.enquiries = response.records;
				}
			});
		}

		loadEnquiries();
		$scope.pageChanged = function() {
			loadEnquiries();
		};

		$scope.notify = function (status, index, event) {
			var enquiry = $scope.enquiries[index];
			dialogService.confirm({ text: 'Are you sure want to '+status+' this enquiry ?', ok: status },event)
            .then(function(result) {
                // cancel
            }, function(ok){
            	_notify(enquiry._id, { type: 'toggleStatus', property_id: enquiry.tenant_enquiries.property_id, status: status, tenant_email:  enquiry.tenant_enquiries.email});
            });
		};

		$scope.organize = function (index, event) {
			var enquiry = $scope.enquiries[index];
			dialogService.confirm({ text: 'Are you sure want to organize refercing for this enquiry ?', ok: 'Yes' },event)
            .then(function(result) {
                // cancel
            }, function(ok){
            	_notify(enquiry._id, { type: 'referencing', property_id: enquiry.tenant_enquiries.property_id,referencing:'scheduled',tenant_email:  enquiry.tenant_enquiries.email});
            });
		};

		function _notify(id, object) {
			RestSvr.put('enquiry_status/', id, object)
        	.then(function (response) {
        		if(response.errors){
        			toastService.alert({ message: response.errors.message, class: 'error' });
        		} else {
        			loadEnquiries();
        			toastService.alert({ message: response.message, class: 'success' });
        		}
        	});
		}

		$scope.makeReferencing = function (index, event) {
			$scope.paymentEnquiry = $scope.enquiries[index];
			$mdDialog.show({
				contentElement: '#paymentConfirmationDialog',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: true
		   });
		};

		$scope.close = function () {
			$mdDialog.hide();
		};

		$scope.pay = function () {
			var enquiry = $scope.paymentEnquiry;
			$mdDialog.hide();
			_notify(enquiry.tenant_enquiries.landlord_id, { type: 'referencing', property_id: enquiry.tenant_enquiries.property_id,referencing:'done',tenant_email:  enquiry.tenant_enquiries.email});
		};

		$scope.filterByPropertySale = function (option) {

		};
	}
]);