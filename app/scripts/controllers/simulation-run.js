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

    $scope.solutionType = 'approximate';

    $scope.simulation = Simulation.get({
      id: $routeParams.id
    });

    $scope.simulation.$promise.then(function() {
      if($scope.ready) {
        return;
      }
      $scope.ready = true;
      $scope.$watch('solutionType', function(type) {
        $scope.progress = 0;

        $scope.simulated = null;
        Simulator.run($scope.simulation, type).then(function(simulated) {
          $scope.simulated = simulated;
        }, function() {
          //TODO: do something on error!
        }, function(progress) {
          $scope.progress = progress;
        });
      });
    });
  });
