"use strict";
/*jslint strict: true */

var app = angular.module('materialism', [
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'angulartics',
  'mgcrea.ngStrap',
  'LocalStorageModule',
  'ngCsv',
  'ngDialog',
  'ngMaterial',
  'ngMessages',
  'ngAria',
  'ui.bootstrap',
  'textAngular',
  'ngCookies'
]);


app.constant("POSTCODE", {
    "API_KEY": "ak_ius21ypnuBLfEO95IfdZpB5WeNEJ6",
    "API_URL": "https://api.ideal-postcodes.co.uk/"
});