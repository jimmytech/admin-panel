'use strict';

angular.module('app.controllers')
    .controller('headerMenuCtrl', ['$rootScope','$scope', '$location', 'CommanSrv',
        function($rootScope, $scope, $location, CommanSrv) {

            function init (){
                $scope.headerPath = $location.path(); 
                $scope.navbarLinks = CommanSrv.navbarLinks();  // get navbar links
                $scope.lastElement = $scope.navbarLinks[$scope.navbarLinks.length-1].url;  // get last url from navbar links array                
            }


            $scope.$on('$routeChangeSuccess', function(e, current, pre) {               
                init();    // get url when route changes         	
            	$scope.headerPath = $location.path();
            	selectMyCherrydoor($scope.lastElement);      // select my cherrydoor tab            
            });

            function selectMyCherrydoor (lastElement){       	
                if ($location.path().split("/")[1] === "my-cherrydoor") {
                    $scope.headerPath = lastElement;
                }     	
            }
            init(); // get url on controller load
        }
]);