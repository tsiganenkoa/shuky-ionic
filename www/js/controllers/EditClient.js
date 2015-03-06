angular.module('myApp.controllers')

        .controller('EditClientCtrl', function ($scope, $state, $http, $stateParams, Utils, $ionicNavBarDelegate, AppConfig, $templateCache, $rootScope) {

          $scope.isCreatePage = ($stateParams.id)?$stateParams.id:'';
          
          $scope.selectedClient = {};

          $scope.isValidForm = function(){
            return $scope.clientForm.$valid;
          };

          $scope.saveClient = function () {
            Utils.showIndicator();
            
            var callback = function (response) {
              if (response.status === 200) {
                $state.go('app.clients', {cache: false}, {reload: true});
              } else {
                Utils.alert(response.data);
              }
              Utils.hideIndicator();
            };
            
            if (!$scope.isCreatePage) {
              $http.post(AppConfig.endpoint + 'clients/', $scope.selectedClient).then(callback);
            } else {
              $http.put(AppConfig.endpoint + 'clients/' + $scope.isCreatePage, $scope.selectedClient).then(callback);
            }
            
          };
          
          $scope.goBack = function () {
            $ionicNavBarDelegate.back();
          };

          $scope.loadSelectedClient = function () {
            Utils.showIndicator();
            $http.get(AppConfig.endpoint + 'clients/' + $scope.isCreatePage)
                    .then(function (response) {
                      var clientInfo = response.data;
                      $scope.selectedClient = clientInfo;

                      Utils.hideIndicator();
                    });
          };

          if ($scope.isCreatePage)
            $scope.loadSelectedClient();
        });