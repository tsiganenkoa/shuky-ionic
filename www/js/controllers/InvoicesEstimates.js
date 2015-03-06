angular.module('myApp.controllers')

        .controller('InvoicesEstimatesCtrl', function ($scope, $state, $http, AppConfig, Utils, $ionicScrollDelegate, $ionicModal) {
          $scope.invoices = [];
          $scope.data = {};
          $scope.isInvoice = $state.includes('app.invoices');
          if ($scope.isInvoice) {
            $scope.getDataUrl = 'invoices';
            $scope.editPageUrl = 'app.edit-invoice';
          } else {
            $scope.getDataUrl = 'estimates';
            $scope.editPageUrl = 'app.edit-estimates';
          }

          $scope.loadInvoices = function () {
            Utils.showIndicator();
            $ionicScrollDelegate.scrollTop(true);
            $http.get(AppConfig.endpoint + $scope.getDataUrl)
                    .then(function (response) {
                      var invoices = response.data;
                      $scope.invoices = invoices;
                      Utils.hideIndicator();
                    });
          };

          $scope.add = function () {
            $state.go($scope.editPageUrl);
          };

          $scope.refresh = function () {
            $scope.loadInvoices();
          };

          $scope.clearSearch = function () {
            $scope.data.searchQuery = '';
          };

          $scope.edit = function (id) {
            $state.go($scope.editPageUrl, {'selectedInvoiceId': id}, {cache: false});
          };

          $scope.delete = function (id) {
            alert(id);
            Utils.showIndicator();
            $http.delete(AppConfig.endpoint + $scope.getDataUrl + '/' + id).then(function (response) {
              console.log(response);
              if (response.status === 200) {
                $scope.refresh();
              } else {
                Utils.alert('Data deleting failed.');
              }
              Utils.hideIndicator();
            });
          };

          $scope.saveClient = function () {
          };

          $scope.loadInvoices();


        });