'use strict';

angular.module('app.controllers')
.controller('landlordBankingCtrl', ['$scope', '$location', 'localStorageService','RestSvr','$rootScope','toastService','dialogService','$timeout',
	function($scope, $location, localStorageService, RestSvr, $rootScope, toastService, dialogService, $timeout){
		// Save New bank detail
		$scope.landlordBankDetails = function (isValid) {
			if(!isValid){
				return;
			}
			RestSvr.put('bank_detail/', $rootScope.user._id, $scope.landlord).then(function(response) {
                if (response.errors) {
                        toastService.alert({message: response.errors.message, class: 'error'});
                } else {
                	load();
                	
            			
        		    $scope.landlordBankForm.$setPristine();
        		    $scope.landlordBankForm.$setUntouched();	
        		    $timeout(function () {
                    	$scope.landlord.bank = {};
                    },1000);
                	
                    toastService.alert({message: response.message, class: 'success'});
                }
            });
		};
		load();
		function load() {
			RestSvr.get('profile/' + $rootScope.user._id).then(function (response) {
				if(response.record.bank){
					$scope.bankDetails = response.record.bank;	
				}
			});	
		}
		
		// Delete bank detail
		$scope.delete = function (index, event) {

			dialogService.confirm({ text: 'Are you sure want to delete this detail ?', ok: 'Delete' },event)
            .then(function(result) {
                /* user has pressed cancel button */
            }, function(ok){
            	var id = $scope.bankDetails[index]._id;
            	RestSvr.delete('bank_detail/', $rootScope.user._id + '/' + id).then(function (response) {
            		if (response.errors) {
                        toastService.alert({message: response.errors.message, class: 'error'});
                	} else {
                		load();
                		toastService.alert({message: response.message, class: 'success'});
                	}
            	});
            });
		};

		// Edit bank detail
		$scope.edit = function (index) {
			var editData = $scope.bankDetails[index];
			$scope.landlord = {bank: editData};
		};

		// Set as Primary
		$scope.makePrimary = function (data) {
			data.primary = true;
			RestSvr.put('make_primary_bank/', $rootScope.user._id, { bank: data }).then(function(response) {
                if (response.errors) {
                        toastService.alert({message: response.errors.message, class: 'error'});
            	} else {
            		load();
            		toastService.alert({message: response.message, class: 'success'});
            	}
            });
		};
	}
]);