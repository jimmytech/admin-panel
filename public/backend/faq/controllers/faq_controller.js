'use strict';

app.controller('faqController', ['toastyService', '$scope', '$location', '$rootScope', '$http', function(toastyService, $scope, $location, $rootScope, $http) {

    $scope.activeInactive = [{
        id: 0,
        name: 'In Active'
    }, {
        id: 1,
        name: 'Active'
    }, ];
    $scope.addNewFaq = function (){
        $location.path('/admin/faq/add-new-faq');
    };
    $scope.to = function(url, id) {
        $location.path(url+id);
    };
    $scope.showFaqList = function() {
        $http.get('/admin/faqList').then(function(response) {
            $scope.faqData = response.data.faq;
            var i;
            for (i = 0; i < response.data.faq.length; i++) {
                $scope.faqData[i].answer = angular.element($scope.faqData[i].answer).text().replace(/\s+/g, ' ');
            }
        });
    };
    $scope.deleteFaq = function(id, index) {
        $http.get('/admin/deleteFaqData?id=' + id).then(function(response) {
            toastyService.notification(response.data.success, response.data.msg);
            if (response.data.success === true) {
                for (var i = 0; i < $scope.faqData.length; i++) {
                    if ($scope.faqData[i]._id == id) {
                        $scope.faqData.splice(i, 1);
                        break;
                    }
                }
            }
        });
    };
    $scope.insertUpdateFaq = function() {
        var text = angular.element($scope.faq.answer).text().replace(/[\s]/g, '');
        if (text) {
            $http.post('/admin/insertUpdateFrequentlyAskedQuestion', $scope.faq).then(function(response) {
                toastyService.notification(response.data.success, response.data.msg);
                if (response.data.success) {
                    $location.path('/admin/faq');
                }
            });
        } else {
            toastyService.notification(false, "Please fill all required flield");
        }
    };

    $scope.faqToedit = function() {
        $scope.slugInput = false;
        var id = $location.path().split("/").pop();
        if (id == 'add-new-faq') {
            $scope.faqPageTittle = "Add New FAQ";
        } else {
            $scope.faqPageTittle = "Edit FAQ";
            $scope.slugInput = true;
            $http.get('/admin/getFaqToedit?id=' + id).then(function(response) {
                if (response.data.success === true) {
                    $scope.faq = response.data.faq;
                }
            });
        }
    };

}]);