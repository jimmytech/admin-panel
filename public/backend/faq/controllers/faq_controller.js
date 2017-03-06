'use strict';

app.controller('faqController', ['http', 'toastyService', '$scope', '$location', '$rootScope', '$http', 
    function(http, toastyService, $scope, $location, $rootScope, $http) {

    (function(){
        showFaqList();
    }());


    /*load faq list*/

    function showFaqList () {
        $http.get('/admin/faq-list').then(function(response) {
            $scope.faqList = response.data;
        });
    }


    /*redirect to add new FAQ page*/

    $scope.addNewFaq = function (url){
        $location.path(url);
    };


    /*delete faq*/

    $scope.moveToTrash = function(id, index) {
        http.get('/admin/move-to-trash-faq?id=' + id).then(function(response) {
            toastyService.notification(response.success, response.msg);
            if (response.success === true) {
                for (var i = 0; i < $scope.faqData.length; i++) {
                    if ($scope.faqData[i]._id == id) {
                        $scope.faqData.splice(i, 1);
                        break;
                    }
                }
            }
        });
    };


    /*redirect to edit or preview page*/

    $scope.to = function(url, id) {
        $location.path(url+id);
    };
}]);