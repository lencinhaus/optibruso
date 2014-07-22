'use strict';

/**
 * @ngdoc function
 * @name optibruso.controller:SimulationRunCtrl
 * @description
 * # SimulationRunCtrl
 * Controller for running a simulation
 */
angular.module('optibruso')
  .controller('SimulationRunCtrl', function ($scope, $routeParams, $location, Simulation) {
    $scope.simulation = Simulation.get({
      id: $routeParams.id
    });
  });
