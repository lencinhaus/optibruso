'use strict';

/**
 * @ngdoc service
 * @name optibruso.service:JsonDateParser
 * @description
 * # JsonDateParser
 * Used to create response transformers that convert the specified fields from timestamps to Javascript Dates
 */

angular.module('optibruso')
  .factory('JsonDateParser', function() {
    return {
      createResourceResponseTransformer: function(fields) {
        var convertFields = function(obj) {
          angular.forEach(fields, function(field) {
            if(!obj[field]) {
              return;
            }
            var timestamp = parseInt(obj[field]);
            obj[field] = new Date(timestamp * 1000);
          });
        };

        return function(raw) {
          var data = angular.fromJson(raw);
          if(angular.isArray(data)) {
            angular.forEach(data, convertFields);
          }
          else {
            convertFields(data);
          }
          return data;
        };
      },
      createResourceRequestTransformer: function(fields) {
        return function(obj) {
          angular.forEach(fields, function(field) {
            if(!obj[field] || typeof(obj[field].getTime) !== 'function') {
              return;
            }
            obj[field] = parseInt(obj[field].getTime() / 1000);
          });
          return angular.toJson(obj);
        };
      }
    };
  });
