
app.factory('validationError', ['$http', 'AlertService', function ($http, AlertService) {    
    return {
        alert: function (names){
        		var invalidForm = 'Please fill all required fields'
                AlertService.popUp({
                    title: "",
                    message: invalidForm,
                    type: 'danger'
                });
        }
    }
}]);

app.factory('useAlertService', ['AlertService', function(AlertService){
    return {
        alert: function(show){
            if(show.result){
                AlertService.popUp({
                    title: "",
                    message: show.message,
                    type: 'success'
                });
            } else {
                AlertService.popUp({
                    title: "",
                    message: show.message,
                    type: 'danger'
                });
            }
        }
    }
}]);

app.factory('bootboxInfo', function(){
    return {
        remove: function(name){
            var info = {
                title: "Remove?",
                message: 'Are you sure you want to Remove ' + name + '?',
            };
            return info;
        },        
        delete: function(name){
            var info = {
                title: "Delete?",
                message: 'Are you sure you want to delete ' + name + '?',
            };
            return info;
        }
    }
});

app.factory('bootBox', function(){
    return {
        alert: function(callback, info){
            bootbox.confirm({
                title: info.title,
                message: info.message,
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> Cancel'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> Confirm'
                    }
                },
                callback: callback
            });
        }
    }
});

app.factory('refreshTimeout', ['$timeout', function($timeout) {
    return {
        run: function(cb) {
            $timeout(cb, 2000);
        }
    }
}]);