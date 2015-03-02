angular.module('myApp.controllers', [])

        .controller('AppCtrl', function($scope, AuthService, $timeout) {
          $scope.logOut = function() {
            AuthService.doLogout();
          };
        });