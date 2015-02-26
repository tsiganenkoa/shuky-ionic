angular.module('myApp.controllers')

        .controller('DashboardCtrl', function($scope, $http, AppConfig, Utils, AuthService, $state) {
          if(!AuthService.isLoggedIn()){
            $state.go('app.login');
            return;
          }
        });