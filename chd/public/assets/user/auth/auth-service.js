'use strict';

angular.module('app.factories')
.factory('AuthSrv', function () {
    var auth = {
        isLogged: false
    };
    return auth;
});