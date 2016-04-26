// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngOpenFB', 'ngCordova'])

  .run(function ($ionicPlatform, ngFB) {

    ngFB.init({appId: '201005016956542',tokenStore : window.localStorage});

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('login', {
          url: '/login',
          templateUrl: 'templates/login.html',
          controller: "LoginCtrl"
        })


        // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

        .state('tab.profile', {
          url: "/profile",
          views: {
            'tab-profile': {
              templateUrl: "templates/tab-profile.html",
              controller: "ProfileCtrl"
            }
          }
        })

      // Each tab has its own nav history stack:

      .state('tab.cards', {
        url: '/cards',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'MyCardsCtrl',
            cache: false
          }
        },
        resolve: {
          cardsList: function (BonusCards, $ionicLoading) {
            $ionicLoading.show();
            return BonusCards.getMyCards().then(function (data) {
              $ionicLoading.hide();
              return data;
            });
          }
        }
      })
      .state('tab.card-detail', {
        url: '/cards/:cardId',
        views: {
          'tab-dash': {
            templateUrl: 'templates/card-detail.html',
            controller: 'MyCardDetailCtrl'
          }
        }
      })

      .state('tab.services', {
        url: '/services',
        views: {
          'tab-services': {
            templateUrl: 'templates/tab-services.html',
            controller: 'ServicesCtrl'
          }
        },
        resolve: {
          serviceList : function (Services, $ionicLoading) {
            $ionicLoading.show();
            return Services.getServices().then(function (data) {
              $ionicLoading.hide();
              return data.data.items;
            });
          }
        }
      })
      .state('tab.card-create', {
        url: '/card-create/:serviceId?isFestCard',
        views: {
          'tab-services': {
            templateUrl: 'templates/card-create.html',
            controller: 'CardCreateCtrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      })

      .state('tab.checkin', {
        url: '/checkin',
        views: {
          'tab-checkin': {
            templateUrl: 'templates/tab-checkin.html',
            controller: 'CheckinCtrl'
          }
        },
        resolve: {
          lokalCard: function (WebApi, $ionicLoading) {
            $ionicLoading.show();
            return WebApi.getLokalCard().then(function (data) {
              $ionicLoading.hide();
              return data;
            });
          }
        },
        cache: false
      })

    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/cards');
  });
