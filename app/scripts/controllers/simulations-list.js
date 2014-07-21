'use strict';

/**
 * @ngdoc function
 * @name optibruso.controller:SimulationsListCtrl
 * @description
 * # SimulationsListCtrl
 * Controller of the simulations list
 */
angular.module('optibruso')
  .controller('SimulationsListCtrl', function ($scope) {
    $scope.simulations = [{
    	id: 123,
    	name: 'Ciccio',
    	modified: new Date()
    }, {
    	id: 234,
    	name: 'Pasticcio',
    	modified: new Date()
    }];

    $scope.remove = function(simulation) {
    	//TODO: remove it!
    	console.log('removing', simulation);
    }
  });
