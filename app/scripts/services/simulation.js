'use strict';

/**
 * @ngdoc service
 * @name optibruso.service:Simulation
 * @description
 * # Simulation
 * The Simulation model
 */

angular.module('optibruso')
  .factory('Simulation', function($resource, JsonDateParser) {
    var dateFields = ['modified'];
    var responseTransformer = JsonDateParser.createResourceResponseTransformer(dateFields);

    return $resource('/server/simulation/:id.json', {
      id: '@id'
    }, {
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: responseTransformer
      },
      get: {
        method: 'GET',
        transformResponse: responseTransformer
      },
      save: {
        method: 'POST',
        transformRequest: function(original) {
          var data = angular.copy(original);
          if(data.id) {
            delete data.id;
          }
          if(data.modified) {
            delete data.modified;
          }
          return angular.toJson(data);
        }
      }
    });
  });
