angular.module('myApp.controllers')

        .controller('EditInvoiceEstimateCtrl', function ($scope, $state, $http, $stateParams, Utils, $ionicNavBarDelegate, AppConfig, $templateCache, $ionicModal) {

          $scope.selectedInvoice = {};
          $scope.clients = [];
          $scope.lineitem = {};
          $scope.docItemList = [];
          $scope.isCreatePage = ($stateParams.id)?$stateParams.id:'';

          $scope.isInvoice = $state.includes('app.edit-invoice');
          if ($scope.isInvoice) {
            $scope.dataUrl = 'invoices/';
            $scope.previousPageUrl = 'app.invoices';
          } else {
            $scope.dataUrl = 'estimates/';
            $scope.previousPageUrl = 'app.estimates';
          }

          $scope.options = {
            FreeText: '', OrderBy: 'OrganizationName'
          };

          $scope.save = function () {
            Utils.showIndicator();

            var callback = function (response) {
              if (response.status === 200) {
                $state.go($scope.previousPageUrl, {cache: false}, {reload: true});
              } else {
                Utils.alert(response.statusText);
              }
              Utils.hideIndicator();
            };

            if (!$scope.isCreatePage) {
              $http.post(AppConfig.endpoint + $scope.dataUrl, $scope.selectedInvoice).then(callback);
            } else {
              $http.put(AppConfig.endpoint + $scope.dataUrl + $scope.isCreatePage, $scope.selectedInvoice).then(callback);
            }
          };
          
          $scope.add = function () {
            $scope.isCreatePage = '';
          };

          $scope.goBack = function () {
            $ionicNavBarDelegate.back();
          };

          $scope.loadSelectedInvoice = function () {
            Utils.showIndicator();
            $http.get(AppConfig.endpoint + $scope.dataUrl + $scope.isCreatePage)
                    .then(function (response) {
                      var InvoiceInfo = response.data;
                      
                      //Selected Invoice or Estimate Information Object.
                      $scope.selectedInvoice = InvoiceInfo;
                      
                      //Convert IssueDate String to valid date type.
                      $scope.selectedInvoice.IssueDate = new Date($scope.selectedInvoice.IssueDate);
                      
                      //Line Items of Invoice or Estimate in Response.
                      $scope.docItemList = $scope.selectedInvoice.DocItems;
                      $http.get(AppConfig.endpoint + 'clients/' + InvoiceInfo.ClientId)
                              .then(function (response) {
                                var clientInfo = response.data;
                                $scope.selectedClient = clientInfo;
                                $scope.clients.push($scope.selectedClient);
                                Utils.hideIndicator();
                              });
                    });
          };
          // Open Client list modal when click Client Name field
          $scope.editClient = function () {
            $ionicModal.fromTemplateUrl('templates/partials/select-clients.html', {
              scope: $scope
            }).then(function (modal) {
              $scope.modal = modal;
              $scope.modal.show();
            });
          }

          $(document).on('search', '#clientsSearchForm', function () {
            $scope.loadClients();
          });

          $scope.clearSearch = function () {
            $scope.options.FreeText = '';
            $scope.loadClients();
          };
          
          // Get Client List with search value.
          $scope.loadClients = function () {
            Utils.showIndicator();
            $http.get(AppConfig.endpoint + 'clients?' + $.param($scope.options))
                    .then(function (response) {
                      var clients = response.data;
                      $scope.clients = clients;
                      Utils.hideIndicator();
                    });
          };

          $scope.select = function (client) {
            Utils.showIndicator();
            $scope.selectedInvoice.ClientId = client.Id;
            $http.get(AppConfig.endpoint + 'clients/' + client.Id)
                    .then(function (response) {
                      var clientInfo = response.data;
                      $scope.selectedClient = clientInfo;
                      $scope.options.FreeText = '';
                      $scope.modal.hide();
                      Utils.hideIndicator();
                      $scope.clients = [clientInfo];
                    });

          }
          // Open Add Line Item Modal
          $scope.addLineItemModal = function () {
            $ionicModal.fromTemplateUrl('templates/partials/add-line-item.html', {
              scope: $scope
            }).then(function (modal) {
              $scope.lineitem = {};
              $scope.addItemModal = modal;
              $scope.addItemModal.show();
            });
          }

          $scope.addLineItem = function () {
            if ($scope.lineitem.ItemId)
              $scope.docItemList.push($scope.lineitem);
            $scope.addItemModal.hide();
          }
          // Swipe delete
          $scope.deleteLineItem = function (index) {
            Utils.confirm('Are you sure to delete this data.', 'Delete data', function () {
              $scope.docItemList.splice(index, 1);
            });
          }
          // If there is param, load Invoices or Estimates according to selected id
          if ($scope.isCreatePage)
            $scope.loadSelectedInvoice();
        });