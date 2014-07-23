'use strict';

/**
 * @ngdoc directive
 * @name obConfirm
 * @module optibruso
 * @description
 * # obConfirm
 * Shows a bootstrap modal dialog for confirmation
 */
angular.module('optibruso')
 .directive('obConfirm', function($modal) {
  return {
    restrict: 'A',
    scope: {
      confirmed: '&obConfirmed'
    },
    link: function(scope, elm, attrs) {
      var message = attrs.obConfirm;
      if(!message) {
        message = 'Proceed?';
      }

      elm.on('click', function() {
        var modalInstance = $modal.open({
          templateUrl: 'views/confirm.html',
          controller: function($scope, $modalInstance, message) {
            $scope.message = message;

            $scope.ok = function() {
              $modalInstance.close();
            };

            $scope.cancel = function() {
              $modalInstance.dismiss();
            };
          },
          resolve: {
            message: function() {
              return message;
            }
          }
        });

        modalInstance.result.then(function() {
          scope.confirmed();
        });
      });
    }
  };
});
