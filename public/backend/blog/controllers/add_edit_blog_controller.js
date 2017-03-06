app.controller('editBlogController', ['$timeout','paging', 'confirmationDialog', 'http', 'Upload', '$routeParams', 'toastyService', '$scope', '$location', '$rootScope', '$http',
    function($timeout, paging, confirmationDialog, http, Upload, $routeParams, toastyService, $scope, $location, $rootScope, $http) {


        /*retrive post detail from server and set page header according to page*/
        
        $scope.postInfo = function() {
            if ($routeParams.key !== "add-new") {
                $scope.pageHeader = "Edit Blog";
                postInfo(function(response){
                    $scope.page = response;
                });                              
            } else {
                $scope.pageHeader = "New Blog";
            }
        };


        /*add new post or update existing post*/

        $scope.addUpdatePost = function(file) {
            var content = angular.element($scope.page.body).text().replace(/[\s]/g, '');
            if (content) {
                Upload.upload({
                    url: '/admin/add-update-post',
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




        /*show post detail on view post page*/
        
        $scope.viewDetail = function() {
            postInfo(function(response){
                $scope.page = response;
                var tag = document.createElement('div');
                tag.innerHTML = response.body;
                $scope.content = tag.innerText;
            });
        };

        /*common function to get post detail*/
        function postInfo(cb) {
            http.get('/admin/post-info?id='+$routeParams.id).then(function(response) {
                cb(response.data);                
            }); 
        }
    }
]);
