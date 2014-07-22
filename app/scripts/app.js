'use strict';

/**
 * @ngdoc overview
 * @name optibruso
 * @description
 * # optibruso
 *
 * Main module of the application.
 */
angular
  .module('optibruso', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    // configure routes
    $routeProvider
      .when('/', {
        templateUrl: 'views/simulations-list.html',
        controller: 'SimulationsListCtrl'
      })
      .when('/simulation/new', {
        templateUrl: 'views/simulation-edit.html',
        controller: 'SimulationEditCtrl'
      })
      .when('/simulation/:id/edit', {
        templateUrl: 'views/simulation-edit.html',
        controller: 'SimulationEditCtrl'
      })
      .when('/simulation/:id', {
        templateUrl: 'views/simulation-run.html',
        controller: 'SimulationRunCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
