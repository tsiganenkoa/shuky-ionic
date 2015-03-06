angular.module('myApp.controllers')

        .controller('EditClientCtrl', function ($scope, $state, $http, $stateParams, Utils, $ionicNavBarDelegate, AppConfig, $templateCache, $rootScope) {

          $scope.isCreatePage = !$stateParams.selectedClientId;
          if ($scope.isCreatePage) {
            $scope.selectedClientId = '';
            $scope.pageTitle = 'Create Client';
          } else {
            $scope.selectedClientId = $stateParams.selectedClientId;
            $scope.pageTitle = 'Edit Client';
          }

          $scope.isiPad = Utils.detectDevice('ipad');
          
          $scope.selectedClient = {};
          console.log('selectedClient', $scope.selectedClientId);

          $scope.isValidForm = function(){
            console.log($scope.clientForm);
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
            
            if ($scope.isCreatePage) {
              $http.post(AppConfig.endpoint + 'clients/' + $scope.selectedClientId, $scope.selectedClient).then(callback);
            } else {
              $http.put(AppConfig.endpoint + 'clients/' + $scope.selectedClientId, $scope.selectedClient).then(callback);
            }
            
          };
          
          $scope.goBack = function () {
            $ionicNavBarDelegate.back();
          };

          $scope.loadSelectedClient = function () {
            Utils.showIndicator();
            $http.get(AppConfig.endpoint + 'clients/' + $scope.selectedClientId)
                    .then(function (response) {
                      var clientInfo = response.data;
                      $scope.selectedClient = clientInfo;

                      Utils.hideIndicator();
                    });
          };

          if (!$scope.isCreatePage)
            $scope.loadSelectedClient();
        });