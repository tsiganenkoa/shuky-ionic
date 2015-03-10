angular.module('myApp.controllers')

        .controller('EditClientCtrl', function ($scope, $state, $http, $stateParams, Utils, $ionicNavBarDelegate, AppConfig, $ionicModal, $rootScope) {

          $scope.isCreatePage = ($stateParams.id)?$stateParams.id:'';
          
          $scope.selectedClient = {};
          $scope.data = {};

          $scope.isValidForm = function(){
            return $scope.clientForm.$valid;
          };

          $scope.save = function () {
            Utils.showIndicator();
            
            var callback = function (response) {
              if (response.status === 200) {
                $state.go('app.clients', {cache: false}, {reload: true});
              } else {                
                Utils.alert(response.data[0].Value);
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
          
          // Open Client list modal when click Client Name field
          $scope.editCountry = function () {
            $ionicModal.fromTemplateUrl('templates/partials/select-country.html', {
              scope: $scope
            }).then(function (modal) {
              $scope.modal = modal;
              $scope.modal.show();
              $scope.data.searchQuery = $scope.selectedClient.Country;
              $scope.loadCountry();
            });
          }
          
          $scope.clearSearch = function () {
            $scope.data.searchQuery = '';
          };
          
          // Get Client List with search value.
          $scope.loadCountry = function () {            
            $scope.countries = Utils.getCountries();
          };

          $scope.select = function (country) {
            $scope.selectedClient.Country = country.Name;
            $scope.selectedClient.CountryId = country.Id;
            $scope.modal.hide();
          }

          if ($scope.isCreatePage)
            $scope.loadSelectedClient();
        });