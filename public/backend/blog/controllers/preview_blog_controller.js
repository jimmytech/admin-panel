'use strict';

app.controller('previewBlogController', ['$timeout','paging', 'confirmationDialog', 'http', 'Upload', '$routeParams', 'toastyService', '$scope', '$location', '$rootScope', '$http',
    function($timeout, paging, confirmationDialog, http, Upload, $routeParams, toastyService, $scope, $location, $rootScope, $http) {


        /*show post detail on view post page*/

        (function(){
            http.get('/admin/post-info?id='+$routeParams.id).then(function(response) {
                $scope.page = response.data;
                var tag = document.createElement('div');
                tag.innerHTML = response.data.body;
                $scope.content = tag.innerText;              
            });         
        }());

    }
]);
