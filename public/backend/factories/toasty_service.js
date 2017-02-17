app.factory('toastyService', ['toasty', function(toasty) {

    return {
        notification: function(status, msg) {
            if (status === true) {
                toasty.success({
                    title: "",
                    msg: msg,
                    showClose: true,
                    clickToClose: true,
                    timeout: 5000,
                    html: true,
                    theme: "bootstrap"
                });
            } else if (status === false) {
                toasty.error({
                    title: "",
                    msg: msg,
                    showClose: true,
                    clickToClose: true,
                    timeout: 5000,
                    html: true,
                    theme: "bootstrap"
                });
            }            
        }
    };
    
}]);