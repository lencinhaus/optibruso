'use strict';

/**
 * @ngdoc function
 * @name optibruso.controller:SimulationRunCtrl
 * @description
 * # SimulationRunCtrl
 * Controller for running a simulation
 */
angular.module('optibruso')
  .controller('SimulationRunCtrl', function ($scope, $routeParams, $location, Simulation, Simulator) {
    $scope.ready = false;

    $scope.simulation = Simulation.get({
      id: $routeParams.id
    });

    $scope.simulation.$promise.then(function() {
      $scope.errors = Simulator.check($scope.simulation);
      if($scope.errors.length == 0) $scope.simulated = Simulator.run($scope.simulation);
      $scope.ready = true;
    });
  });
