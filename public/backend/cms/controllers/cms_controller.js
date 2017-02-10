app.controller('cmsController', ['Upload','$routeParams','toastyService', '$scope', '$location', '$rootScope', '$http', 
    function(Upload, $routeParams, toastyService, $scope, $location, $rootScope, $http) {

        $scope.showPagesList = function() {
            $http.get('/admin/get-cms-page').success(function(response) {
                $scope.pages = response.pages;
            });
        };

        $scope.deletePage = function(id, index) {
            $http.get('/admin/delete-cms-page?id=' + id).success(function(response) {
                toastyService.notification(response.success, response.msg);
                if (response.success === true) {
                    for (var i = 0; i < $scope.pages.length; i++) {
                        if ($scope.pages[i]._id == id) {
                            $scope.pages.splice(i, 1);
                            break;
                        }
                    }
                }
            });
        };

        $scope.editpage = function() {
            var page = $routeParams.page;
            if (page == 'add-new-page') {
                $scope.csmPageTittle = "Add New Page";
            } else {
                $scope.csmPageTittle = "Edit Page";
                $http.get('/admin/cms-page-by-id?id=' + page).success(function(response) {
                    $scope.page = response.page;
                });
            }
        };

        $scope.updatePage = function(file) {
            if (!$scope.page.content) {
                toastyService.notification(false, "Please fill all required flield");
            } else {
                Upload.upload({
                    url: '/admin/insert-update-page',
                    data: {
                        file: file,
                        pageInfo: $scope.page
                    }
                }).then(function(response) {
                toastyService.notification(response.data.success, response.data.msg);
                if (response.data.success) {
                    $location.path('/admin/pages');
                }
                });   
            }

        }; 
        
        $scope.viewDetailPage = function(id){
            $location.path('/admin/page/detail/'+id);
        }; 

        $scope.viewDetail = function(){
            $http.get('/admin/cms-page-by-id?id=' + $routeParams.id).success(function(response) {
                $scope.page = response.page;
            });  
        };             

}]);