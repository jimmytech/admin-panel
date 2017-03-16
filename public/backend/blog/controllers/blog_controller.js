app.controller('blogController', ['sortIcon', '$timeout','paging', 'confirmationDialog', 'http', 'Upload', '$routeParams', 'toastyService', '$scope', '$location', '$rootScope', '$http',
    function(sortIcon, $timeout, paging, confirmationDialog, http, Upload, $routeParams, toastyService, $scope, $location, $rootScope, $http) {

        (function(){

            initBlogsInfo();

            getPostsList();

        }());


        /*set pagination parameter from values when blog.html will load*/

        function initBlogsInfo () { 
            $scope.sortOn = "created_at";
            $scope.sortType = -1;
            var page = angular.isDefined($routeParams.page) ? $routeParams.page : 1;           

            $scope.paging = {page: page};
            $scope.forceEllipses = paging.forceEllipses;
            $scope.maxSize = paging.maxSize;

            $scope.titleIcon = 'fa fa-sort-alpha-asc';
            $scope.authorIcon = "fa fa-sort-alpha-asc";
            $scope.orderIcon = "fa fa-sort-numeric-asc";
            $scope.typeIcon = "fa fa-sort-alpha-asc";
            $scope.statusIcon = "fa fa-sort-alpha-asc";           
        }



        /*get post list when blog.html will load*/

        function getPostsList (sort) {  
            var page = angular.isDefined($scope.paging) ? $scope.paging.page : 1;
            console.log(page);
            http.get('/admin/posts-list?page='+page+'&sortOn='+$scope.sortOn+'&sortType='+$scope.sortType).then(function(response) { 
                $scope.postResponse = response;  
                $scope.paging = response.paging;
            });
            $scope.more = 'getPostsList';
        }



        /*search result from post list*/

        $scope.search = function(searchFor, more){  
            $scope.more = 'search';
            $scope.searchFor = searchFor;
            http.get('/admin/search-post?searchFor='+searchFor).then(function(response){
                 $scope.postResponse = response; 
                 $scope.paging.count = null;                               
            });
        };        



        /*search on change of inputs*/

        $scope.changeSearch = function(searchFor){
            if (angular.isUndefined(searchFor)) {
                getPostsList();
            } else{
                $scope.search(searchFor);                
            }            
        };



        /*update page count in url*/

        function setPageNumber (n){
            $location.search("page", n);
        }



        /**/

        $scope.sort = function(searchFor, sortOn, event){
            setPageNumber(1);
            $scope.paging.page = 1;
            $scope.alpha = ['fa fa-sort-alpha-asc', 'fa fa-sort-alpha-desc'];
            $scope.numeric = ['fa fa-sort-numeric-asc', 'fa fa-sort-numeric-desc'];

            var className = event.currentTarget.className;       

            $(event.target).removeClass(className);
            var index;
            var sortType;
            if ($scope.alpha.indexOf(className) !== -1) {

                 index = $scope.alpha.indexOf(className) == 1 ? 0 : 1;
                $(event.target).addClass($scope.alpha[index]);
                sortType = index === 0 ? -1 : 1;

            } else if ($scope.numeric.indexOf(className) !== -1) {

                 index = $scope.numeric.indexOf(className) == 1 ? 0 : 1;
                $(event.target).addClass($scope.numeric[index]);
                sortType = index === 0 ? -1 : 1;

            }

            if (angular.isUndefined(searchFor)) {
                $scope.sortOn = sortOn;
                $scope.sortType = sortType;
                getPostsList();
            }   
        };



        /*get more result by pagination*/

        $scope.getMorePosts = function(){                            
            if ( $scope.more == 'getPostsList') {
                setPageNumber($scope.paging.page);
                getPostsList();
            } else if ( $scope.more == 'search') {
                var searchFor = $scope.searchFor;
                $scope.search(searchFor, 'more');
            }
        };



        /*redirect to edit page*/

        $scope.editBlogPage = function(url, id) {
            $location.path(url+id);
        };



        /*redirect to add new post page*/

        $scope.addPost = function(url) {
            $location.path(url);
        };



        /*remove post but this function will not delete it permanently*/

        $scope.deletePost = function(id, index, ev) {  
            confirmationDialog.confirm(ev, function(result){
                result.then(function(){
                    http.delete('/admin/delete-post/' + id).then(function(response) {
                        toastyService.notification(response.result.success, response.result.msg);
                        if (response.result.success) {
                            $scope.postResponse.data.splice(index, 1);
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
    }
]);
