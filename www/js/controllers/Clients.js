angular.module('myApp.controllers')

        .controller('ClientsCtrl', function ($scope, $state, $http, AppConfig, Utils, $ionicScrollDelegate, $ionicModal) {
          $scope.clients = [];
          $scope.searchword = '';
          $scope.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
          $scope.dividers = [];
          $scope.dividedClients = [];
          $scope.isMoreClients = false;

          $scope.options = {
            FreeText: '', StatusId: 1, Skip: 0, Top: 20, OrderBy: 'OrganizationName'
          };
          $(document).on('search', '#clientsSearchForm', function () {
            $scope.options.Skip = 0;
            $scope.isMoreClients = false;
            $scope.loadClients();
          });
          // Load Clients with search prefix and scroll loading index
          $scope.loadClients = function () {
            if ($scope.options.Skip === 0) {
              Utils.showIndicator();
              $ionicScrollDelegate.scrollTop(true);
            }
            $http.get(AppConfig.endpoint + 'clients?' + $.param($scope.options))
                    .then(function (response) {
                      var clients = response.data;
                      if ($scope.options.Skip === 0) {
                        $scope.clients = clients;
                      } else {
                        $scope.clients = $scope.clients.concat(clients);
                      }
                      $scope.isMoreClients = clients.length >= $scope.options.Top;
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                      $scope.divideClients();
                      Utils.hideIndicator();
                    });
          };
          // Set skip value when down scrolling and load new datas with this value
          $scope.loadMoreClients = function () {
            $scope.options.Skip += $scope.options.Top;
            $scope.loadClients();
          };
          // Add dividers to group with first prefix.
          $scope.divideClients = function () {
            var clients = $scope.clients;
            clients = _.sortBy(clients, function (c) {
              return c.OrganizationName;
            });
            var tmp = {};
            $scope.dividers = [];
            var re = /[a-zA-Z]/;
            var dividers = [];
            _.each(clients, function (c) {
              var letter = (c.OrganizationName || '').charAt(0).toUpperCase();
              if (!re.test(letter)) {
                letter = '#';
              }
              tmp[letter] = tmp[letter] || [];
              tmp[letter].push(c);
              dividers.push(letter);
            });
            dividers = $.unique(dividers);
            $scope.dividers = dividers;
            $scope.dividedClients = tmp;
            return tmp;
          };

          $scope.add = function () {
            $state.go('app.edit-client');
          };

          $scope.refresh = function () {
            $scope.options.Skip = 0;
            $scope.isMoreClients = false;
            $scope.loadClients();
          };

          $scope.clearSearch = function () {
            $scope.options.FreeText = '';
            $scope.options.Skip = 0;
            $scope.isMoreClients = false;
            $scope.loadClients();
          };

          $scope.edit = function (id) {
            $state.go('app.edit-client', {'id': id}, {cache: false});
          };
          //Swipe delete 
          $scope.delete = function (id) {
            Utils.confirm('Are you sure to delete this data.', 'Delete data', function () {
              Utils.showIndicator();
              $http.delete(AppConfig.endpoint + 'clients/' + id).then(function (response) {
                console.log(response);
                if (response.status === 200) {
                  $scope.refresh();
                } else {
                  alert('Data deleting failed.');
                }
                Utils.hideIndicator();
              });
            });

          };

          $scope.loadClients();

        });