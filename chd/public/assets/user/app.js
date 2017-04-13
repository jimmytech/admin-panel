'use strict';

angular.module('cherrydoor', [
	'ngMaterial',
	'ngAnimate',
	'ngSanitize',
	'app.routes',
	'app.config',
	'app.controllers',
	'app.directives',
	'app.factories',
	'app.filters',
	'ngMessages',
	'LocalStorageModule',
	'ui.bootstrap',
	'ngMap',
	'ngScrollbars',
	'ngImgCrop',
	'ngFileUpload',
	'fancyboxplus',
	'angular-intro'

]);

/* Setting up new module with its corresponding dependencies */

angular.module('app.controllers', []);
angular.module('app.factories', []);
angular.module('app.directives', []);
angular.module('app.filters', []);
