'use strict';

/**
 * @ngdoc directive
 * @name validatedFormGroup
 * @module optibruso
 * @description
 * # validatedFormGroup
 * Creates a form group with validation
 */
 angular.module('optibruso')
 .directive('validatedFormGroup', function() {
  return {
    require: '^form',
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: 'views/validated-form-group.html',
    scope: {
      feedback: '='
    },
    link: function($scope, $element, $attrs, formCtrl, $transclude) {
      var name;

      $scope.show = false;

      $scope.getField = function() {
        if(!name) {
          return null;
        }
        return formCtrl[name];
      };

      $scope.isValid = function() {
        var field = $scope.getField();
        return !!(field && field.$valid);
      };

      $scope.showValid = function() {
        return $scope.show && $scope.isValid();
      };

      $scope.showInvalid = function() {
        return $scope.show && !$scope.isValid();
      };

      var showValidity = function() {
        $scope.show = true;
      };

      $transclude(function(clone) {
        $element.prepend(clone);

        var control = $element[0].querySelector('[name]');
        var controlNg = angular.element(control);
        name = controlNg.attr('name');

        controlNg.bind('blur', function() {
          showValidity();
          $scope.$apply();
        });

        $scope.$on('validated-form-show-validity', showValidity);
      });
    },
    controller: function($scope) {
      this.scope = $scope;
    }
  };
});
