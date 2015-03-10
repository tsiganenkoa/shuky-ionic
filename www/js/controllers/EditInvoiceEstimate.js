angular.module('myApp.controllers')

        .controller('EditInvoiceEstimateCtrl', function ($scope, $state, $http, $stateParams, Utils, $ionicNavBarDelegate, AppConfig, $templateCache, $ionicModal) {

          $scope.selectedInvoice = {};
          $scope.clients = [];
          $scope.lineitem = {};

          $scope.summaryData = {subTotal:0, Tax:0, Total:0};
          $scope.docItemList = [];
          $scope.isCreatePage = ($stateParams.id) ? $stateParams.id : '';

          $scope.isInvoice = $state.includes('app.edit-invoice');
          if ($scope.isInvoice) {
            $scope.dataUrl = 'invoices/';
            $scope.previousPageUrl = 'app.invoices';
          } else {
            $scope.dataUrl = 'estimates/';
            $scope.previousPageUrl = 'app.estimates';
          }

          $scope.options = {
            FreeText: '', StatusId: 1, OrderBy: 'OrganizationName'
          };
          $scope.selectedInvoice.IssueDate = new Date();

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
            $scope.selectedInvoice.DocItems = $scope.docItemList;

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
                      $scope.docItemList = ($scope.selectedInvoice.DocItems) ? $scope.selectedInvoice.DocItems : [];
                      $scope.setSumaryData();
                      $http.get(AppConfig.endpoint + 'clients/' + InvoiceInfo.ClientId)
                              .then(function (response) {
                                var clientInfo = response.data;
                                $scope.selectedClient = clientInfo;
                                $scope.clients.push($scope.selectedClient);
                                Utils.hideIndicator();
                              });
                    });
          };
          // Get Tax, SubTotal and Total.
          $scope.setSumaryData = function () {
            if ($scope.docItemList.length) {
              $scope.summaryData = {subTotal:0, Tax:0, Total:0};
              for (var i = 0; i < $scope.docItemList.length; i++) {
                var subTotal = 0;
                var taxVal = 0;
                var Total = 0;
                if ($scope.docItemList[i].ItemPrice && $scope.docItemList[i].ItemQuantity) {
                  console.log('tax' + i, $scope.docItemList[i]);
                  subTotal = $scope.docItemList[i].ItemPrice * $scope.docItemList[i].ItemQuantity;
                  if ($scope.docItemList[i].TaxId1) {
                    var tax1 = Utils.getTaxById($scope.docItemList[i].TaxId1);
                    if(tax1) taxVal = tax1.Rate / 100 * subTotal;
                  }
                  if ($scope.docItemList[i].TaxId2) {
                    var tax2 = Utils.getTaxById($scope.docItemList[i].TaxId2);
                    if(tax2) taxVal += tax2.Rate / 100 * subTotal;
                  }
                  Total = subTotal + taxVal;
                  console.log('Total' + i, Total);
                }
                $scope.summaryData.subTotal += subTotal;
                $scope.summaryData.Tax += taxVal;
                $scope.summaryData.Total += Total;
                
              }
            }
          }
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
            $scope.taxes = Utils.getTaxes();
            $ionicModal.fromTemplateUrl('templates/partials/add-line-item.html', {
              scope: $scope
            }).then(function (modal) {

              $scope.addItemModal = modal;
              $scope.addItemModal.show();
            });
          }

          $scope.addLineItem = function () {
            if(!$scope.setTotal()){
              Utils.alert('Total price is zero. Please check Item price and Quantity.', '', function (){
                return;
              });
            } else {
              if ($scope.lineitem.ItemId)
                $scope.docItemList.push($scope.lineitem);
              $scope.addItemModal.hide();
              $scope.setSumaryData();
            }            
          }

          $scope.setTotal = function () {
            var taxValueOne = 0;
            var taxValueTwo = 0;
            if (isNaN($scope.lineitem.ItemPrice))
              return;
            if (isNaN($scope.lineitem.ItemQuantity))
              return;
            var subTotal = $scope.lineitem.ItemPrice * $scope.lineitem.ItemQuantity;
            if ($scope.lineitem.TaxId1) {
              var tax1 = Utils.getTaxById($scope.lineitem.TaxId1);
              taxValueOne = tax1.Rate / 100 * subTotal;
            }
            if ($scope.lineitem.TaxId2) {
              var tax2 = Utils.getTaxById($scope.lineitem.TaxId2);
              taxValueTwo = tax2.Rate / 100 * subTotal;
            }
            var total = subTotal + taxValueTwo + taxValueOne;

            return total;
          }
          // Swipe Line Item delete
          $scope.deleteLineItem = function (index) {
            Utils.confirm('Are you sure to delete this data.', 'Delete data', function () {
              $scope.docItemList.splice(index, 1);
              $scope.setSumaryData();
            });
          }
          // Swipe Line Item edit
          $scope.editLineItem = function (index) {
            $scope.lineitem = $scope.docItemList[index];
            $scope.taxes = Utils.getTaxes();
            $ionicModal.fromTemplateUrl('templates/partials/add-line-item.html', {
              scope: $scope
            }).then(function (modal) {
              $scope.addItemModal = modal;
              $scope.addItemModal.show();
            });
          }
          // If there is param, load Invoices or Estimates according to selected id
          if ($scope.isCreatePage)
            $scope.loadSelectedInvoice();
        });