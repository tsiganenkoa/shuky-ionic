'use strict';

angular.module('myApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.dashboard', {
        url: '/dashboard',
        views: {
          'menuContent': {
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardCtrl'
          }
        }
      })
      .state('app.clients', {
        url: '/clients',
        views: {
          'menuContent': {
            templateUrl: 'templates/clients.html',
            controller: 'ClientsCtrl'
          }
        }
      })
      .state('app.edit-client', {
        url: '/edit-client:selectedClientId',
        views: {
          'menuContent': {
            templateUrl: 'templates/edit-client.html',
            controller: 'EditClientCtrl'
          }
        }
      })
      .state('app.items', {
        url: '/items',
        views: {
          'menuContent': {
            templateUrl: 'templates/items.html'
          }
        }
      })
      .state('app.invoices', {
        url: '/invoices',
        views: {
          'menuContent': {
            templateUrl: 'templates/invoices-estimates.html',
            controller: 'InvoicesEstimatesCtrl'
          }
        }
      })
      .state('app.edit-invoice', {
        url: '/edit-invoice:selectedInvoiceId',
        views: {
          'menuContent': {
            templateUrl: 'templates/edit-invoice-estimate.html',
            controller: 'EditInvoiceEstimateCtrl'
          }
        }
      })
      .state('app.estimates', {
        url: '/estimates',
        views: {
          'menuContent': {
            templateUrl: 'templates/invoices-estimates.html',
            controller: 'InvoicesEstimatesCtrl'
          }
        }
      })
      .state('app.edit-estimates', {
        url: '/edit-estimates:selectedInvoiceId',
        views: {
          'menuContent': {
            templateUrl: 'templates/edit-invoice-estimate.html',
            controller: 'EditInvoiceEstimateCtrl'
          }
        }
      })
      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/dashboard');
  });
