'use strict';

/**
 * @ngdoc service
 * @name pwilApp.AuthService
 * @description
 * # authservice
 * Service in the pwilApp.
 */
angular.module('pwilApp')
  .service('AuthService', function($q, $http, API_ENDPOINT,$rootScope) {
    var LOCAL_TOKEN_KEY = 'pwilIsAwesome';//'yourTokenKey';
    var isAuthenticated = false;
    var mail ='';
    var authToken;
    var old_cluster='';

    function loadUserCredentials() {
      var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) {
        useCredentials(token);
      }
    }

    function storeUserCredentials(token,mail,username) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      window.localStorage.setItem('USER_MAIL', mail);
      window.localStorage.setItem('USER_PSEUDO', username);
      $rootScope.userMail = window.localStorage.getItem('USER_MAIL');
      $rootScope.username = window.localStorage.getItem('USER_PSEUDO');      
      useCredentials(token);
    }

    function useCredentials(token) {
      isAuthenticated = true;
      authToken = token;

      // Set the token as header for your requests!
      $http.defaults.headers.common.Authorization = authToken;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      isAuthenticated = false;
      $http.defaults.headers.common.Authorization = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var register = function(user) {
      return $q(function(resolve, reject) {
        $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
          if (result.data.success) {
            resolve(result.data.msg);
          } else {
            reject(result.data.msg);
            console.log(result.data.msg);
          }
        });
      });
    };

    var login = function(user) {
      return $q(function(resolve, reject) {
        $http.post(API_ENDPOINT.url + '/authenticate', user).then(function(result) {
          if (result.data.success) {
            old_cluster = result.data.old_cluster;
            storeUserCredentials(result.data.token, user.mail, result.data.username);
            resolve(result.data.msg);
          } else {
            reject(result.data.msg);
          }
        });
      });
    };

    var logout = function() {
      destroyUserCredentials();
    };

    loadUserCredentials();

    return {
      login: login,
      register: register,
      logout: logout,
      mail: function() {return mail;},
      isAuthenticated: function() {return isAuthenticated;},
      old_cluster: function() {return old_cluster;}
    };
  })

  .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
      responseError: function (response) {
        $rootScope.$broadcast({
          401: AUTH_EVENTS.notAuthenticated,
        }[response.status], response);
        return $q.reject(response);
      }
    };
  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });
