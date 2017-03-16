'use strict';

app.controller('faqController', ['confirmationDialog', 'sortIcon', 'http', 'toastyService', '$scope', '$location', '$rootScope', '$http', 
    function(confirmationDialog, sortIcon, http, toastyService, $scope, $location, $rootScope, $http) {

    (function(){
            $scope.alphaAsc = 'fa fa-sort-alpha-asc';
            $scope.numericAsc = "fa fa-sort-numeric-asc";        
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

    $scope.moveToTrash = function(id, index, event) {
        confirmationDialog.confirm(event, function(result){
            result.then(function(){
                http.get('/admin/move-to-trash-faq?id=' + id).then(function(response) {
                    toastyService.notification(response.success, response.msg);
                    if (response.success === true) {
                         $scope.faqList.faq.splice(index, 1);
                    }
                });
            }, function(){                
            });
        });       

    };


    /*redirect to edit or preview page*/

    $scope.to = function(url, id) {
        $location.path(url+id);
    };

        $scope.sort = function (type, event) {            
            var as_ds = sortIcon.set(event);  
            var sortType = as_ds === 1 ? '' : "-";
            $scope.sortByOrder = sortType+' '+type;          
        };    
}]);