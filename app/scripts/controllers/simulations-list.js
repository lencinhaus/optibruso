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
    $scope.simulations = Simulation.query();

    $scope.remove = function(id) {
      Simulation.delete({
        id: id
      }, function() {
        $scope.simulations = Simulation.query();
      });
    };
  });
