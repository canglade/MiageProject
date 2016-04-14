'use strict';

/**
 * @ngdoc service
 * @name pwilApp.serviceDb
 * @description
 * # serviceDb
 * Factory in the pwilApp.
 */
angular.module('pwilApp')
  .factory('serviceDb', function ($http) {
    return {
      songs: function(){
        return $http.get("http://localhost:3000/songs");
      },
      getAllObjects: function(collection){
        return  $http({
          method: 'GET',
          url: 'http://localhost:3000/' + collection
        });
      },
      createObject: function(collection, data){
        return  $http({
          method: 'POST',
          url: 'http://localhost:3000/' + collection + '/',
          data: data,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  });
