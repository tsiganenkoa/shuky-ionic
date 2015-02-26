angular.module('myApp.controllers')

        .controller('ClientsCtrl', function($scope, $http, AppConfig, Utils, $filter) {
          $scope.clients = [];
          $scope.searchword = '';
          $scope.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
          $scope.dividers = [];
          $scope.dividedClients = [];
          
          $(document).on('search', '#clientsSearchForm', function(){
            $scope.divideClients();
          });

          $scope.loadClients = function(searchword) {
            Utils.showIndicator();
            $http.get(AppConfig.endpoint + 'clients', {freeText: searchword})
                    .then(function(response) {
                      //.log(response.data);
                      $scope.clients = response.data;
                      $scope.divideClients();
                      Utils.hideIndicator();
                    });
          };

          $scope.divideClients = function() {
            var clients = $filter('clientsSearch')($scope.clients, $scope.searchword);
            clients = _.sortBy(clients, function(c) {
              return c.OrganizationName || c.Email;
            });
            var tmp = {};
            $scope.dividers = [];
            var re = /[a-zA-Z]/;
            var dividers = [];
            _.each(clients, function(c) {
              var letter = (c.OrganizationName || c.Email).charAt(0).toUpperCase();
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
          
          $scope.clearSearch = function(){
            $scope.searchword = '';
            $scope.divideClients();
            //$scope.loadClients($scope.searchword);
          };

          $scope.loadClients();

        });