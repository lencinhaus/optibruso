'use strict';

/**
 * @ngdoc function
 * @name optibruso.controller:SimulationEditCtrl
 * @description
 * # SimulationEditCtrl
 * Controller for editing a simulation
 */
angular.module('optibruso')
  .controller('SimulationEditCtrl', function ($scope, $routeParams) {
    if($routeParams.id) {
        //TODO: use real data!
        $scope.simulation = {
            id: 123,
            name: 'ciao',
            modified: new Date(),
            budget: 123456,
            services: [{
                name: 'Anestesia',
                budgetCost: 123,
                ticketCost: 234,
                privateGain: 456,
                minimumNumber: 10,
                minimumBudgetCost: null,
                maximumNumber: null,
                maximumBudgetCost: null
            }, {
                name: 'Trapianto',
                budgetCost: 200,
                ticketCost: 600,
                privateGain: 0,
                minimumNumber: null,
                minimumBudgetCost: 10000,
                maximumNumber: null,
                maximumBudgetCost: 30000
            }]
        }
    }
    else {
        $scope.simulation = {
            name: '',
            modified: new Date(),
            budget: null,
            services: []
        }
    }
  });
