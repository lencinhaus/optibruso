'use strict';

/**
 * @ngdoc service
 * @name optibruso.service:Simulator
 * @description
 * # Simulator
 * A service for running simulations
 */

angular.module('optibruso')
  .factory('Simulator', function($q, $log) {
    var buildResultsAndResolve = function(deferred, simulation, solution) {
      // create the results
      var results = [];
      var totalProfit = 0;
      var totalGain = 0;
      var totalRefund = 0;
      angular.forEach(solution, function(quantity, index) {
        var service = simulation.services[index];
        var gain = service.ticket + service.refund + service.privateGain;
        var profit = gain - service.cost;
        var profitPerUnitOfRefund = profit / service.refund;
        var totalQuantity = service.minimum + quantity;
        var result = {
          gainPerUnit: gain,
          profitPerUnit: profit,
          profitPerUnitOfRefund: profitPerUnitOfRefund,
          quantity: totalQuantity,
          gain: totalQuantity * gain,
          profit: totalQuantity * profit,
          refund: totalQuantity * service.refund,
          index: index
        };
        results.push(result);
        totalProfit += result.profit;
        totalRefund += result.refund;
        totalGain += result.gain;
      });

      // sort results by decreasing profit per unit of refund
      results.sort(function(a, b) {
        return b.profitPerUnitOfRefund - a.profitPerUnitOfRefund;
      });

      // resolve with the solution
      deferred.resolve({
        gain: totalGain,
        profit: totalProfit,
        refund: totalRefund,
        results: results
      });
    };

    // build an approximate solution using the greedy algorithm for knapsack
    var computeApproximateSolution = function(simulation) {
      // calculate profits per unit of budget and sort them
      // init solution
      // calculate minimum total refund
      var profitsPerUnitOfBudget = [];
      var totalRefund = 0;
      var solution = [];
      angular.forEach(simulation.services, function(service, index) {
        profitsPerUnitOfBudget.push({
          index: index,
          profit: (service.ticket + service.refund + service.privateGain - service.cost) / service.refund
        });
        solution.push(0);
        totalRefund += service.minimum * service.refund;
      });
      profitsPerUnitOfBudget.sort(function(a, b) {
        return b.profit - a.profit;
      });

      var i = 0;
      while(i < profitsPerUnitOfBudget.length && totalRefund < simulation.budget) {
        var tmp = profitsPerUnitOfBudget[i++];
        var profit = tmp.profit;
        if(profit < 0) {
          break;
        }
        var index = tmp.index;
        var service = simulation.services[index];

        var maxQuantity = Math.floor((simulation.budget - totalRefund) / service.refund);

        if(service.maximum) {
          maxQuantity = Math.min(maxQuantity, service.maximum - service.minimum);
        }

        if(maxQuantity <= 0) {
          continue;
        }

        solution[index] += maxQuantity;
        totalRefund += maxQuantity * service.refund;
      }

      return solution;
    };

    return {
      run: function(simulation, type) {
        // create the deferred
        var deferred = $q.defer();

        if(type === 'exact') {
          // calculate the minimum refund
          var minimumRefund = 0;
          angular.forEach(simulation.services, function(service) {
            minimumRefund += service.minimum * service.refund;
          });

          // build the problem
          var problem = {
            capacity: simulation.budget - minimumRefund, // the available capacity is the remaining budget
            objects: []
          };

          angular.forEach(simulation.services, function(service) {
            var profit = service.ticket + service.refund + service.privateGain - service.cost;
            problem.objects.push({
              value: profit,
              weight: service.refund,
              max: (!service.maximum) ? 0 : service.maximum - service.minimum
            });
          });

          // launch the worker
          var worker = new Worker('scripts/workers/knapsack.js');
          worker.onmessage = function(e) {
            if(e.data.action === 'log') {
              $log.log.apply($log, e.data.args);
            }
            else if(e.data.action === 'progress') {
              deferred.notify(e.data.progress);
            }
            else if(e.data.action === 'solution') {
              var solution = e.data.solution;

              buildResultsAndResolve(deferred, simulation, solution);
            }
          };
          worker.postMessage(problem);
        }
        else if(type === 'approximate') {
          var solution = computeApproximateSolution(simulation);

          buildResultsAndResolve(deferred, simulation, solution);
        }

        // return the promise
        return deferred.promise;
      }
    };
  });
