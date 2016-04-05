angular.module('starter.controllers', ['starter.services', 'ngOpenFB'])

  /* MyCardsCtrl */
  .controller('MyCardsCtrl', function ($scope, BonusCards, CONFIG, LoginService) {
    LoginService.loginCheck();
    $scope.cards = [];
    $scope.defaultLogo = CONFIG.defaultLogoUrl;

    BonusCards.getMyCards().then(function (data) {
      $scope.cards = data.data.items;
    });

    $scope.removeCard = function (card) {
      BonusCards.removeCard(card.id).then(function () {
        $scope.cards.splice($scope.cards.indexOf(card), 1);
      })
    };
  })

  .controller('LoginCtrl', function ($scope, ngFB, LoginService, $state, LoginService) {
    if (window.localStorage.tokenApi) {
      $state.go('tab.cards', {}, {reload: true})
    }
    $scope.fbLogin = function () {
      ngFB.login({scope: 'email,publish_actions'}).then(
        function (response) {
          if (response.status === 'connected') {
            console.log('Facebook login succeeded');
            LoginService.afterLogin();
          } else {
            alert('Facebook login failed');
          }
        });
    };

  })

  /* MyCardDetailCtrl */
  .controller('MyCardDetailCtrl', function ($scope, $stateParams, BonusCards, CONFIG, LoginService, CardHelper) {
    LoginService.loginCheck();
    $scope.card = {};
    $scope.getCardLogo = CardHelper.getCardLogo;

    BonusCards.getCard($stateParams.cardId).then(function (data) {
      $scope.card = data.data;
    });
  })

  /* ServicesCtrl */
  .controller('ServicesCtrl', function ($scope, Services, LoginService) {
    LoginService.loginCheck();
    $scope.services = [];
    Services.getServices().then(function (data) {
      $scope.services = data.data.items;
    });

  })

  .controller('ProfileCtrl', function ($scope, ngFB, $state, LoginService) {
    LoginService.loginCheck();
    ngFB.api({
      path: '/me',
      params: {fields: 'id,name'}
    }).then(
      function (user) {
        $scope.user = user;
      },
      function (error) {
        alert('Facebook error: ' + error.message);
      });

    $scope.logout = function () {
      localStorage.clear();
      $state.go('login', {}, {reload: true}, {reload: true})
    };
  })

  .controller('AccountCtrl', function ($scope, LoginService) {
    LoginService.loginCheck();

    $scope.settings = {
      enableFriends: true
    };
  })

  /* CardCreateCtrl */
  .controller('CardCreateCtrl', function ($scope, $stateParams, $cordovaBarcodeScanner, LoginService, WebApi, $q, $state) {
    LoginService.loginCheck();

    $scope.currentServiceId = $stateParams.serviceId ? $stateParams.serviceId : false;

    $scope.scanBarcode = function () {
      $cordovaBarcodeScanner.scan().then(function (imageData) {
        $scope.barcode = imageData.text;
        console.log("Barcode Format -> " + imageData.format);
        console.log("Cancelled -> " + imageData.cancelled);
      }, function (error) {
        console.log("An error happened -> " + error);
      });
    };

    $scope.submit = function submit() {
      var promise = $q.defer(),
        option = {
          name: $scope.name,
          service_id: $stateParams.serviceId,
          code: $scope.barcode
        };

      WebApi.addCard(option).then(function (response) {
        $scope.barcode = $scope.name = '';
        $state.go('tab.card-detail', {"cardId": response.data.data.id});
      }, function (error) {
        alert(error.data.data[0].message);
        promise.reject(error);
      });
    }
  });


