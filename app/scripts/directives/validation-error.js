'use strict';

/**
 * @ngdoc directive
 * @name validationError
 * @module optibruso
 * @description
 * # validationError
 * Creates an error inside a validated form group
 */
 angular.module('optibruso')
 .directive('validationError', function() {
  return {
    require: '^validatedFormGroup',
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: 'views/validation-error.html',
    scope: {
      type: '@'
    },
    link: function(scope, element, attrs, groupCtrl) {
      scope.show = function() {
        var show = false;
        if(groupCtrl.scope.showInvalid()) {
          if(scope.type) {
            show = groupCtrl.scope.getField().$error[scope.type];
          }
          else {
            show = true;
          }
        }
        return show;
      };
    }
  };
});
