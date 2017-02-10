'use strict';

app.controller('faqController', ['toastyService', '$scope', '$location', '$rootScope', '$http', function(toastyService, $scope, $location, $rootScope, $http) {

    $scope.activeInactive = [{
        id: 0,
        name: 'In Active'
    }, {
        id: 1,
        name: 'Active'
    }, ];

    $scope.showFaqList = function() {
        $http.get('/admin/faqList').success(function(response) {
            $scope.faqData = response.faq;
            var i;
            for (i = 0; i < response.faq.length; i++) {
                $scope.faqData[i].answer = angular.element($scope.faqData[i].answer).text().replace(/\s+/g, ' ');
            }
        });
    };
    $scope.deleteFaq = function(id, index) {
        $http.get('/admin/deleteFaqData?id=' + id).success(function(response) {
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
    $scope.insertUpdateFaq = function() {
        var text = angular.element($scope.faq.answer).text().replace(/[\s]/g, '');
        if (text) {
            $http.post('/admin/insertUpdateFrequentlyAskedQuestion', $scope.faq).success(function(response) {
                toastyService.notification(response.success, response.msg);
                if (response.success) {
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
            $http.get('/admin/getFaqToedit?id=' + id).success(function(response) {
                if (response.success === true) {
                    $scope.faq = response.faq;
                }
            });
        }
    };

}]);