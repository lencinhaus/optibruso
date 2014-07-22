'use strict';

/**
 * @ngdoc function
 * @name optibruso.controller:SimulationsListCtrl
 * @description
 * # SimulationsListCtrl
 * Controller of the simulations list
 */
angular.module('optibruso')
  .controller('SimulationsListCtrl', function ($scope, Simulation) {
    $scope.ready = false;

    $scope.simulations = Simulation.query();

    $scope.simulations.$promise.then(function() {
      $scope.ready = true;
    });

    $scope.remove = function(id) {
      Simulation.delete({
        id: id
      }, function() {
        $scope.simulations = Simulation.query();
      });
    };
  });
