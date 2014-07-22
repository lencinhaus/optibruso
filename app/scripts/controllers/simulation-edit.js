'use strict';

/**
 * @ngdoc function
 * @name optibruso.controller:SimulationEditCtrl
 * @description
 * # SimulationEditCtrl
 * Controller for editing a simulation
 */
angular.module('optibruso')
  .controller('SimulationEditCtrl', function ($scope, $routeParams, $location, Simulation) {
    $scope.addService = function() {
      $scope.simulation.services.push({
        name: null,
        ticket: null,
        refund: null,
        minimum: 0,
        maximum: null
      });
    };

    $scope.removeService = function(index) {
      if(index < 0 || index >= $scope.simulation.services.length) {
        return;
      }

      $scope.simulation.services.splice(index, 1);
    };

    $scope.save = function(cb) {
      $scope.$broadcast('validated-form-show-validity');
      if(!$scope.form.$valid) {
        return false;
      }

      Simulation.save($scope.simulation, cb);

      return true;
    };

    $scope.saveAndContinue = function() {
      $scope.save(function(simulation) {
        if(!$routeParams.id) {
          $location.path('/simulation/' + simulation.id + '/edit');
        }
      });
    };

    $scope.saveAndRun = function() {
      $scope.save(function(simulation) {
        $location.path('/simulation/' + simulation.id);
      });
    };

    if($routeParams.id) {
      $scope.simulation = Simulation.get({
        id: $routeParams.id
      });
    }
    else {
      $scope.simulation = {
        name: '',
        modified: new Date(),
        budget: null,
        services: []
      };

      $scope.addService();
    }
  });
