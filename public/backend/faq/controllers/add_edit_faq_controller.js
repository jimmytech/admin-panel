'use strict';

app.controller('addEditFaqController', ['htmlToText', '$scope', '$location', 'http', 'toastyService',
	function (htmlToText, $scope, $location, http, toastyService) {

	(function(){
		if ($location.path() === "/admin/faq/new") {
			$scope.pageHeader = "Add New FAQ";
		} else {
			$scope.pageHeader = "Edit";
		}
		editOrPreviewFaq();
	}());


    $scope.insertUpdateFaq = function() {

        var text = angular.element($scope.faq.answer).text().replace(/[\s]/g, '');

        if (text) {

            http.post('/admin/insert-update-faq', $scope.faq).then(function(response) {
                toastyService.notification(response.result.success, response.result.msg);
                if (response.result.success) {
                    $location.path('/admin/faq');
                }
            });

        } else {

            toastyService.notification(false, "Please fill all required flield");
            
        }

    };

    function editOrPreviewFaq () {
        
        var id = $location.path().split("/").pop();
        if (id == 'new') {
        	$scope.slugInput = false;
        } else {
            $scope.slugInput = true;
            http.get('/admin/faq-detail?id=' + id).then(function(response) {

            	$scope.answer = htmlToText.convert(response.faq.answer);

                if (response.success === true) {
                    $scope.faq = response.faq;
                }
            });
        }

    }

}]);