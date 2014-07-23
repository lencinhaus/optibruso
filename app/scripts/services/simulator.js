'use strict';

/**
 * @ngdoc service
 * @name optibruso.service:Simulator
 * @description
 * # Simulator
 * A service for running simulations
 */

angular.module('optibruso')
  .factory('Simulator', function() {
    return {
      check: function(simulation) {
        var errors = [];

        // calculate minimum total refund
        var minTotalRefund = 0;
        angular.forEach(simulation.services, function(service) {
          minTotalRefund += service.refund * service.minimum;
        });

        if(minTotalRefund > simulation.budget) {
          errors.push('minimum-total-refund-exceeds-budget');
        }

        return errors;
      },
      run: function(simulation) {
        var totalRefund = 0;

        // initialize data
        var results = [];

        angular.forEach(simulation.services, function(service, index) {
          var profitPerUnitOfRefund = (service.ticket + service.refund + service.privateGain - service.cost) / service.refund;
          var result = {
            profitPerUnitOfRefund: profitPerUnitOfRefund,
            quantity: service.minimum,
            index: index
          };

          totalRefund += service.minimum * service.refund;

          results.push(result);
        });

        // sort results by decreasing profit per unit of refund
        results.sort(function(a, b) {
          return b.profitPerUnitOfRefund - a.profitPerUnitOfRefund;
        });

        // increase quantities of services with the maximum profit
        var i = 0;
        while(i < results.length && totalRefund < simulation.budget) {
          var result = results[i++];
          var service = simulation.services[result.index];

          if(result.profitPerUnitOfRefund < 0) break;

          var maxQuantity = Math.floor((simulation.budget - totalRefund) / service.refund);
          if(service.maximum) maxQuantity = Math.min(maxQuantity, service.maximum - result.quantity);
          if(maxQuantity <= 0) continue;

          result.quantity += maxQuantity;
          totalRefund += maxQuantity * service.refund;
        }

        // calculate service refunds and profits and total profit
        var totalProfit = 0;
        angular.forEach(simulation.services, function(service, index) {
          var result = results[index];
          result.refund = result.quantity * service.refund;
          result.profit = result.profitPerUnitOfRefund * result.refund;
          totalProfit += result.profit;
        });

        return {
          profit: totalProfit,
          refund: totalRefund,
          results: results
        };
      }
    };
  });
