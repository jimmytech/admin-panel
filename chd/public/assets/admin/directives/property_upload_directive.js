'use strict';

app.directive('dropzone', [function () {

    return {
        scope : {
            dropzone : '=', //http://www.dropzonejs.com/#configuration-options
        },
        link: function(scope, element, attrs){

            var config, dropzone;
            config = scope.dropzone;
            dropzone = new Dropzone(element[0], config.options);
            angular.forEach(config.eventHandlers, function (handler, event) {
                dropzone.on(event, handler);
            });
        }
    };
}]);