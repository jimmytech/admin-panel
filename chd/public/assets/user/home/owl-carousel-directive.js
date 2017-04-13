'use strict';
angular.module('app.directives')
.directive("owlCarousel", ['$timeout', function($timeout) {
	return {
		restrict: 'E',
		transclude: false,
		link: function (scope) {
			scope.initCarousel = function(element) {
			  // provide any default options you want
				var defaultOptions = {
				};
				var customOptions = scope.$eval($(element).attr('data-options'));
				// combine the two options objects
				for(var key in customOptions) {
					defaultOptions[key] = customOptions[key];
				}
				// init carousel
				$(element).owlCarousel(defaultOptions);
			};
		}
	};
}])
.directive('owlCarouselItem', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		transclude: false,
		link: function(scope, element) {
		  // wait for the last item in the ng-repeat then call init
			if(scope.$last) {
				$timeout(function(){
					scope.initCarousel(element.parent());
				},100);
			}
		}
	};
}])
.directive("owlCarouselThumb1", ['$timeout', function($timeout) {
	return {
		restrict: 'E',
		transclude: false,
		link: function (scope) {
			scope.initCarousel1 = function(element) {
			  // provide any default options you want
				var defaultOptions = {
				};
				var customOptions = scope.$eval($(element).attr('data-options'));
				// combine the two options objects
				for(var key in customOptions) {
					defaultOptions[key] = customOptions[key];
				}
				// init carousel
				$(element).owlCarousel(defaultOptions).on('changed.owl.carousel', syncPosition);
			};
		}
	};
}])
.directive("owlCarouselThumb2", ['$timeout', function($timeout) {
	return {
		restrict: 'E',
		transclude: false,
		link: function (scope) {
			scope.initCarousel2 = function(element) {
			  // provide any default options you want
				var defaultOptions = {
				};
				var customOptions = scope.$eval($(element).attr('data-options'));
				// combine the two options objects
				for(var key in customOptions) {
					defaultOptions[key] = customOptions[key];
				}
				// init carousel
				$(element).owlCarousel(defaultOptions).on('changed.owl.carousel', syncPosition2);
			};
		}
	};
}])
.directive('owlCarouselThumbItemFirst', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		transclude: false,
		link: function(scope, element) {
		  // wait for the last item in the ng-repeat then call init
			if(scope.$last) {
				$timeout(function(){
					scope.initCarousel1(element.parent());
				},100);
			}
		}
	};
}])
.directive('owlCarouselThumbItemSecond', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		transclude: false,
		link: function(scope, element) {
		  // wait for the last item in the ng-repeat then call init
			if(scope.$last) {
				$timeout(function(){
					scope.initCarousel2(element.parent());
				},100);
			}
		}
	};
}]);
function syncPosition(el) {
    //if you set loop to false, you have to restore this next line
    //var current = el.item.index;
    
    //if you disable loop you have to comment this block
    var count = el.item.count-1;
    var current = Math.round(el.item.index - (el.item.count/2) - 0.5);
    
    if(current < 0) {
      current = count;
    }
    if(current > count) {
      current = 0;
    }
    
    //end block
    var sync2 = angular.element('#sync2');
    sync2
      .find(".owl-item")
      .removeClass("current")
      .eq(current)
      .addClass("current");
    var onscreen = sync2.find('.owl-item.active').length - 1;
    var start = sync2.find('.owl-item.active').first().index();
    var end = sync2.find('.owl-item.active').last().index();
    //console.log(sync2);
    //console.log(sync2.data('owl.carousel'));
    if (current > end) {
      sync2.data('owl.carousel').to(current, 100, true);
    }
    if (current < start) {
      sync2.data('owl.carousel').to(current - onscreen, 100, true);
    }
  }
  
  function syncPosition2(el) {
    
      var number = el.item.index;
      var sync1 = angular.element('#sync1');
      sync1.data('owl.carousel').to(number, 100, true);
    
  }