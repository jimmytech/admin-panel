app.controller('blogController', ['paging', 'confirmationDialog', 'http', 'Upload', '$routeParams', 'toastyService', '$scope', '$location', '$rootScope', '$http',
    function(paging, confirmationDialog, http, Upload, $routeParams, toastyService, $scope, $location, $rootScope, $http) {

        /*set pagination parameter from values when blog.html will load*/
        $scope.paginationParameter = function() {
            $scope.paging = {
                page: paging.page
            };
            $scope.forceEllipses = paging.forceEllipses;
            $scope.maxSize = paging.maxSize;
        };

        /*search result from post list*/
        $scope.search = function(searchFor){
            http.get('/admin/search-post?searchFor='+searchFor).then(function(response){
                 $scope.postResponse = response; 
                 
            });
        };

        /*get post list when blog.html will load*/
        $scope.getPostsList = function() {      
            http.get('/admin/posts-list?page='+$scope.paging.page).then(function(response) { 
                $scope.postResponse = response;  
                $scope.paging = response.paging;
            });
        };

        /*redirect to edit page*/
        $scope.editBlogPage = function(url, id) {
            $location.path(url+id);
        };

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

        /*redirect to add new post page*/
        $scope.addPost = function(url) {
            $location.path(url);
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

        /*remove post but this function will not delete it permanently*/
        $scope.deletePost = function(id, index, ev) {   
            confirmationDialog.confirm(ev, function(result){
                result.then(function(){
                    http.delete('/admin/delete-post/' + id).then(function(response) {
                        toastyService.notification(response.result.success, response.result.msg);
                        if (response.result.success) {
                            $scope.data.splice(index, 1);
                        }                
                    });
                }, function(){
                });
            });     
        };

        /*redirect to post preview page*/
        $scope.postPreviewPage = function(url, id) {
            $location.path(url + id);
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
