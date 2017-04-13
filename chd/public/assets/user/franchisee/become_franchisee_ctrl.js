'use strict';

angular.module('app.controllers')
    .controller('becomeFranchiseeCtrl', ['$location', 'toastService', 'RestSvr', '$scope', '$mdConstant',
        function($location, toastService, RestSvr, $scope, $mdConstant) {
            $scope.becomeFranchisee = function() {
                RestSvr.post('become_franchisee_request', $scope.request).then(function(response) {
                    if(response.errors){
                        toastService.alert({
                            message: response.errors.message,
                            class: 'error'
                        });
                    } else {
                        $location.path('/');
                        toastService.alert({
                            message: response.message,
                            class: 'success'
                        });
                    }
                });
            };

        }
    ]);