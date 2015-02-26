angular.module('myApp.controllers')

        .controller('LoginCtrl', function($scope, $http, $state, $ionicSideMenuDelegate, AppConfig, Utils, AuthService) {
          $ionicSideMenuDelegate.canDragContent(false);

          $scope.loginData = {};

          $scope.doLogin = function() {
            $scope.isLogingin = true;
            Utils.showIndicator();
            $http.post(AppConfig.endpoint + 'login/authenticate', $scope.loginData).then(function(response) {
              console.log(response);
              if (response.status === 200) {
                $scope.isInvalidLogin = false;
                AuthService.setAuthToken(response.data.Key, 'X');
                $state.go('app.dashboard');
              } else {
                $scope.isInvalidLogin = true;
              }
              $scope.isLogingin = false;
              Utils.hideIndicator();
            });
          };
        });