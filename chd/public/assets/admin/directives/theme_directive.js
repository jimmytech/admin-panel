app.directive('formControl', function($timeout) {
  return {
    restrict: 'C',
    link: function(scope, element, attrs) {
      $timeout(function(){
      if(element.val()){
        element.parent().addClass('filled');
      }
      element.bind('blur', function (e) {
        var input = angular.element(e.currentTarget);
        if(input.val()){
          input.parent().addClass('filled');
        } else {
          input.parent().removeClass('filled');
        }
        input.parent().removeClass('active');
      }).bind('focus', function (e) {
        var input = angular.element(e.currentTarget);
        input.parent().addClass('active');
      });
  },1000);
    }
  };
});

app.directive('autofocus', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function ($scope, $element) {
      $timeout(function () {
        $element[0].focus();
      });
    }
  };
}]);

app.directive('numbersOnly', function () {
  return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
              scope.numErr = false;
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                     scope.numErr = true;
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});

// app.directive('toggleLabel', function(){
  

// })


app.filter('nospace', function () {
  return function (value) {
    return (!value) ? '' : value.replace(/ /g, '');
  };
});


app.run(['$rootScope', '$analytics', function ($rootScope, $analytics) {
  $rootScope.$on('theme:change', function(event, msg) {
    $analytics.eventTrack(msg, {  category: 'Themepicker' });
  });
}]);



app.directive('menuToggle', ['$location', function($location) {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    scope: {
      name: '@',
      icon: '@'
    },
    templateUrl: 'assets/admin/templates/menu-toggle.html',
    link: function(scope, element, attrs) {
      var icon = attrs.icon;
      if ( icon ) {
        element.children().first().prepend('<i class="' + icon + '"></i>&nbsp;');
      }

      element.children().first().on('click', function(e) {
        e.preventDefault();
        var link = angular.element(e.currentTarget);

        if( link.hasClass('active') ) {
          link.removeClass('active');
        } else {
          link.addClass('active');
        }
      });

      element.find('a').ripples();

      scope.isOpen = function() {
        var folder = '/' + $location.path().split('/')[1];
        return folder == attrs.path;
      };
    }
  };
}]);





app.filter('unique', function() {
   // we will return a function which will take in a collection
   // and a keyname
   return function(collection, keyname) {
      // we define our output and keys array;
      var output = [], 
          keys = [];

      // we utilize angular's foreach function
      // this takes in our original collection and an iterator function
      angular.forEach(collection, function(item) {
          // we check to see whether our object exists
          var key = item[keyname];
          // if it's not already part of our keys array
          if(keys.indexOf(key) === -1) {
              // add it to our keys array
              keys.push(key); 
              // push this item to our final output array
              output.push(item);
          }
      });
      // return our array which should be devoid of
      // any duplicates
      return output;
   };
});