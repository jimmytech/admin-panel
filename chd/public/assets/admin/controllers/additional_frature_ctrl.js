app.controller('additionalFeatureCtrl', ['$window', '$routeParams', 'useAlertService', 'AlertService', '$http', 'validationError', '$mdConstant', '$scope', 'RestSvr', '$location',
    function($window, $routeParams, useAlertService, AlertService, $http, validationError, $mdConstant, $scope, RestSvr, $location) {

        $scope.additionalExclusion = {};
        $scope.additionalExclusion.feature = [];
        $scope.additionalExclusion.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, 186];

        /*add new Additional Exclusion*/
        $scope.addAdditionalExclusion = function() {
            var featurelist = {
                list: $scope.additionalExclusion.feature,
                 tooltip_text: $scope.additionalExclusion.tooltip_text
            };
            console.log(featurelist);
            RestSvr.post('/admin/new-additional-feature', featurelist).then(function(response) {
                useAlertService.alert(response);
                if (response.result) {
                    $location.path('/property-management/additional-feature');
                }
            });
        };
        /*get Additional Exclusion detail by using its id*/
        $scope.editpage = function(id) {
            $location.path('/property-management/additional-feature/edit/' + id);
        };

        $scope.getAdditionalfeatureDataToedit = function() {
            $scope.pageHeader = 'Edit additional feature';
            RestSvr.getById('/admin/get-additional-feature?id=' + $routeParams.id).then(function(response) {
                if (response.result) {
                    $scope.newadditionalfeature = response.data.additional_feature[0];
                } else {
                    useAlertService.alert(response);
                }
            });
        };

        /*update Additional Exclusion detail to perform edit/update*/
        $scope.update = function(data) {
            var featureDetail = {
                name: data.name,
                tooltip_text: data.tooltip_text
            };
            RestSvr.put('/admin/update-additional-feature/', $routeParams.id, featureDetail).then(function(response) {
                useAlertService.alert(response);
                if (response.result === true) {
                    $location.path('/property-management/additional-feature');
                }
            });
        };



        $scope.delete = function(id, index, name){
            bootbox.confirm({
                title: "Delete?",
                message: 'Are you sure you want to Delete ' + name + '?',
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> Cancel'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> Confirm'
                    }
                },
                callback: function(result) {
                    if (result === true) {
                        RestSvr.delete('/admin/delete-additional-feature/'+id).then(function(response){
                            useAlertService.alert(response);
                            $scope.additionalfeatureRecord.splice(index, 1);
                        });
                    }
                }
            });            
        };

        /*redirect to Additional Exclusion listing page*/
        $scope.addAdditionalFeaturePage = function() {
            $location.path('/property-management/additional-feature/new');
        };

        /*get Additional Exclusion list and show*/
        $scope.additionalfeatureList = function() {
            $scope.pageHeader = 'Additional Feature';
            RestSvr.get('/admin/get-additional-feature-list').then(function(response) {
                if (response.record === null) {
                    $scope.additionalfeatureRecord = [];
                } else {
                    $scope.additionalfeatureRecord = response.record.additional_feature;
                }
            });
        };

        /*change additional exclusion state*/
        $scope.activeInactive = function(id, status, name, index){
            bootbox.confirm({
                title: "Change status?",
                message: 'Are you sure you want to update ' + name + '?',
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> Cancel'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> Confirm'
                    }
                },
                callback: function(result) {
                    var updated = status === false? true : false;
                    if (result === true) {
                        var state = {
                            status: status
                        };                       
                        RestSvr.put('/admin/active-inactive-additional-feature/', id, state).then(function(response) {                            
                             $scope.additionalfeatureRecord[index].status = updated;
                             useAlertService.alert(response);
                        });
                    }
                }
            });
        };

        /*fire invalid form error message if form is invalid */
        $scope.validate = function() {
            validationError.alert();
        };

        $scope.back = function() {
            $window.history.back();
        };
    }
]);