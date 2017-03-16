app.controller('cmsController', ['sortIcon', 'confirmationDialog', 'http', 'Upload','$routeParams','toastyService', '$scope', '$location', '$rootScope', '$http', 
    function(sortIcon, confirmationDialog, http, Upload, $routeParams, toastyService, $scope, $location, $rootScope, $http) {
        
        (function(){

            $scope.alphaAsc = 'fa fa-sort-alpha-asc';
            $scope.numericAsc = "fa fa-sort-numeric-asc";

            showPagesList();

        }());

        function showPagesList() {
            http.get('/admin/get-cms-page?sort='+"created_at").then(function(response) {
                $scope.pageResult = response;
            });
        }

        $scope.addNew = function (url){
            $location.path(url);
        };
        
        $scope.redirectTo = function(url, id) {
            $location.path(url+id);
        };

        $scope.delete = function(id, index, ev) {
            confirmationDialog.confirm(event, function(result){
                result.then(function(){
                    http.get('/admin/delete-cms-page?id=' + id).then(function(response) {
                        toastyService.notification(response.success, response.msg);
                        if (response.success === true) {
                            for (var i = 0; i < $scope.pageResult.page.length; i++) {
                                if ($scope.pageResult.page[i]._id == id) {
                                    $scope.pageResult.page.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });
                }, function(){
                });             
            });


        }; 

        $scope.sort = function (type, event) {            
            var as_ds = sortIcon.set(event);  
            var sortType = as_ds === 1 ? '' : "-";
            $scope.sortByOrder = sortType+' '+type;          
        };      

}]);