app

.directive('numbersOnly', function(){
       return {
         require: 'ngModel',
         link: function(scope, element, attrs, modelCtrl) {
           modelCtrl.$parsers.push(function (inputValue) {
               if (inputValue === undefined) return ''; 
               var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
               if (transformedInput!=inputValue) {
                  modelCtrl.$setViewValue(transformedInput);
                  modelCtrl.$render();
               }        

               return transformedInput;         
           });
         }
       };
    })

.directive('setHeight', ['$window', function($window){
    return {
        restrict:'A',
        link: function(scope, element, attrs){
            element.css('min-height', ($window.innerHeight - 50) + 'px');
        }
    };
}])


.directive( 'backButton', function() {
    return {
        restrict: 'A',
        link: function( scope, element, attrs ) {
            element.on( 'click', function () {
                history.back();
                scope.$apply();
            });
        }
    };
});