app.factory('postcodeService', ['PostcodeSvr', 'useAlertService', 'RestSvr', '$mdDialog', function(PostcodeSvr, useAlertService, RestSvr, $mdDialog) {
    return {
        check: function(postcode) {
            return PostcodeSvr.lookup(postcode, true).then(function(response) {
                return response.data.result;
            }, function(err) {
                var response = {
                    result: false,
                    message: err.data.message
                };
                useAlertService.alert(response);
            });
        },
        addPostcode: function(postcodeInfo){
            console.log(postcodeInfo);
                return RestSvr.post('/admin/add-new-post-code', postcodeInfo).then(function(response) {
                    useAlertService.alert(response);
                    if (response.result) {
                        $mdDialog.cancel();
                    }
                });
        }

    };
}]);