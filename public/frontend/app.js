'use strict';

var app = angular.module('myApp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'ui.bootstrap',
    'angular-toasty',
    'ngImgCrop',
    'ngFileUpload',
    'ngCookies',
    'ngMap',
    'ngScrollbars'
]);

app.run(['$window', function($window){
	var lastScrollTop = 0, direction="";
	angular.element($window).bind("scroll", function() {  
	  var st = window.pageYOffset;
	  direction = (st >= lastScrollTop) ? "down" : "up";
      lastScrollTop = st;
      if(direction=='down'){
      	angular.element(document.querySelector(".hdrfixed")).addClass("down").removeClass("up");
      }else{
      	angular.element(document.querySelector(".hdrfixed")).addClass("up").removeClass("down");
      }
	});
	
}]);