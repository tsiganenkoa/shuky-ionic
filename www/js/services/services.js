'use strict';

angular.module('myApp.services', [])
        .factory('Utils', function ($ionicLoading, $ionicPopup, AppConfig, $http) {
          var UtilsSrv = {
            config: null,
            countries:[],
            taxes:[],
            showIndicator: function () {
              window.iL = $ionicLoading;
              console.log('SHOW INDICATOR');
              $ionicLoading.show({
                template: '<span class="preloader preloader-white"></span>'
              });
            },
            hideIndicator: function () {
              $ionicLoading.hide();
            },
            alert: function (msg, title, callback) {
              title = title || AppConfig.organizationName;
              var alertPopup = $ionicPopup.alert({
                title: title,
                template: msg
              });
              if (callback) {
                alertPopup.then(function (res) {
                  callback();
                });
              }
            },
            confirm: function (msg, title, success, cancel) {
              var confirmPopup = $ionicPopup.confirm({
                title: title || AppConfig.organizationName,
                template: msg
              });
              confirmPopup.then(function (res) {
                if (res) {
                  if (success)
                    success();
                } else {
                  if (cancel)
                    cancel();
                }
              });
            },
            correctImageDataURI: function (dataURI) {
              //if mime type is not defined(specifically on samsung galaxy)
              if (/data:;?base64,/.test(dataURI)) {
                dataURI = dataURI.replace(/data:;?base64,/, 'data:image/jpeg;base64,');
              }
              return dataURI;
            },
            detectDevice: function (deviceType) {
              //Return boolean value according to deviceType
              var deviceInfo = window.navigator.userAgent;
              if (deviceInfo.toLowerCase().indexOf(deviceType) >= 0)
                return true
              else
                return false;
            },
            loadCountries: function () {
              $http.get(AppConfig.endpoint + 'definitions/countries')
                    .then(function (response) {
                      var countries = response.data;
                      UtilsSrv.countries = countries;
                      return UtilsSrv.countries;
                    });
            },
            getCountries: function () {
              if(UtilsSrv.countries.length)
                return UtilsSrv.countries;
              else
                return UtilsSrv.loadCountries();
            },
            loadTaxes: function () {
              $http.get(AppConfig.endpoint + 'settings/taxes')
                    .then(function (response) {
                      var taxes = response.data;
                      UtilsSrv.taxes = taxes;
                      return UtilsSrv.taxes;
                    });
            },
            getTaxes: function () {
              if(UtilsSrv.taxes.length)
                return UtilsSrv.taxes;
              else
                return UtilsSrv.loadTaxes();
            },
            getTaxById: function (taxId) {
              if(UtilsSrv.taxes.length)
                for (var i = 0; i < UtilsSrv.taxes.length; i++)
                  if(taxId == UtilsSrv.taxes[i].Id)
                    return UtilsSrv.taxes[i];
              else
                return false;
            }
          };

          return UtilsSrv;
        });
