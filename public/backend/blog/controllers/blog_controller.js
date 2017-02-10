app.controller('blogController', ['Upload', '$routeParams', 'toastyService', '$scope', '$location', '$rootScope', '$http',
    function(Upload, $routeParams, toastyService, $scope, $location, $rootScope, $http) {

        $scope.getPostData = function() {
            $http.get('/admin/get-post-data').success(function(response) {
                $scope.data = response.data;
            });
        };

        $scope.addPost = function() {
            $location.path('/admin/post/add-new');
        };
        $scope.addUpdatePost = function(file) {
            ck = angular.element($scope.page.body).text().replace(/[\s]/g, '');
            if (ck) {
                Upload.upload({
                    url: '/admin/addUpdatePost',
                    data: {
                        file: file,
                        userData: $scope.page
                    }
                }).then(function(response) {
                    var res = response.data;
                    toastyService.notification(res.success, res.msg);
                    if (res.success) {
                        $location.path('/admin/posts');
                    }
                });
            } else {
                toastyService.notification(false, "Please fill all required fields");
            }

        };

        $scope.postDataToEdit = function() {
            if ($routeParams.key !== "add-new") {
                $scope.pageHeader = "Edit Post";
                $http.get('/admin/post-data-to-edit?id=' + $routeParams.key).success(function(response) {
                    $scope.page = response.data[0];
                });
            } else {
                $scope.pageHeader = "New Post";
            }

        };

        $scope.delete = function(id, index) {            
            $http.delete('/admin/delete-post-data/' + id).success(function(response) {
                toastyService.notification(response.success, response.msg);
                if (response.success) {
                    $scope.data.splice(index, 1);
                }                
            });
        };

        $scope.viewDetailPage = function(id) {
            $location.path('/admin/view-post-info/' + id);
        };

        $scope.viewDetail = function(id) {
            $http.get('/admin/post-data-to-edit?id=' + $routeParams.id).then(function(response) {
                $scope.page = response.data.data[0];
            });
        };


    }
]);
