'use strict';

/**
 * @ngdoc directive
 * @name integer
 * @module optibruso
 * @description
 * # integer
 * Integer validator
 */
angular.module('optibruso')
 .directive('integer', function() {
  var INTEGER_REGEXP = /^\-?\d+$/;

  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          ctrl.$setValidity('integer', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('integer', false);
          return undefined;
        }
      });
    }
  };
});
