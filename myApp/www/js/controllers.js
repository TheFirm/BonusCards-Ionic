angular.module('starter.controllers', ['starter.services', 'ngOpenFB'])

  /* MyCardsCtrl */
  .controller('MainCtrl', function ($scope, $state) {
    $scope.onTabSelected = function(state) {
      $state.go(state);
    };
  })

  /* MyCardsCtrl */
  .controller('MyCardsCtrl', function ($scope, BonusCards, CONFIG, LoginService, $state, cardsList, $ionicHistory) {
    LoginService.loginCheck();
    $ionicHistory.clearHistory();

    $scope.defaultLogo = CONFIG.defaultLogoUrl;
    $scope.cards = cardsList.data.items;

    $scope.removeCard = function (card) {
      BonusCards.removeCard(card.id).then(function () {
        $scope.cards.splice($scope.cards.indexOf(card), 1);
      })
    };
  })

  .controller('LoginCtrl', function ($scope, ngFB, LoginService, $state, $ionicPopup) {
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
            $ionicPopup.alert({
              title: 'Error',
              content: 'Facebook login failed'
            });
          }
        });
    };

  })

  /* MyCardDetailCtrl */
  .controller('MyCardDetailCtrl', function ($scope, $stateParams, BonusCards, CONFIG, LoginService, CardHelper,  $ionicHistory) {
    LoginService.loginCheck();
    $scope.card = {};

    $scope.getCardLogo = CardHelper.getCardLogo;

    BonusCards.getCard($stateParams.cardId).then(function (data) {
      $scope.card = data.data;
      $scope.cardName =  $scope.card.name?$scope.card.name:$scope.card.service.name;
    });



  })

  /* ServicesCtrl */
  .controller('ServicesCtrl', function ($scope, Services, LoginService) {
    LoginService.loginCheck();
    $scope.services = [];
    Services.getServices().then(function (data) {
      $scope.services = data.data.items;
    });
    $scope.doRefresh = function() {
      Services.getServices().then(function (data) {
        $scope.services = data.data.items;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
    }


  })

  .controller('ProfileCtrl', function ($scope, ngFB, $state, LoginService, $ionicPopup) {
    LoginService.loginCheck();
    ngFB.api({
      path: '/me',
      params: {fields: 'id,name'}
    }).then(
      function (user) {
        $scope.user = user;
      },
      function (error) {
        $ionicPopup.alert({
          title: 'Error',
          content: error.message
        });
      });

    $scope.logout = function () {
      localStorage.clear();
      $state.go('login', {}, {reload: true}, {reload: true})
    };
  })


  /* CardCreateCtrl */
  .controller('CardCreateCtrl', function ($scope, $stateParams, $cordovaBarcodeScanner, LoginService, WebApi, $q, $state, $ionicPopup)  {
    LoginService.loginCheck();

    $scope.currentServiceId = $stateParams.serviceId ? $stateParams.serviceId : false;

    $scope.onTabSelected = function() {
      $state.go('tab.services');
    };

    $scope.scanBarcode = function () {
      $cordovaBarcodeScanner.scan().then(function (imageData) {
        $scope.barcode = imageData.text;
        console.log("Barcode Format -> " + imageData.format);
        console.log("Cancelled -> " + imageData.cancelled);
      }, function (error) {
        console.log("An error happened -> " + error);
      });
    };

    $scope.submit = function () {
      var option = {
          name: $scope.name,
          service_id: $stateParams.serviceId,
          code: $scope.barcode
        };

      WebApi.addCard(option).then(function (response) {
        $scope.barcode = $scope.name = '';

        $state.go('tab.card-detail', {"cardId": response.data.data.id});
      }, function (error) {
        $ionicPopup.alert({
          title: 'Error',
          content: error.data.data[0].message
        });
      });
    }
  })


  /* CardCreateCtrl */
  .controller('CheckinCtrl', function ($scope, LoginService, cardsList, $cordovaBarcodeScanner, WebApi, $ionicPopup)  {
    LoginService.loginCheck();

    $scope.selectedCafe = {value : null};
    $scope.table = {id : null};

    /* Get first !fest card data */
    if(cardsList.data.items){
      $scope.card = cardsList.data.items.filter(function (card) {
        return card.service.id == 1;
      })[0];
    }

    WebApi.getCafes().then(function (response) {
      $scope.cafes = response.data.data;
    });


    $scope.scanBarcode = function () {
      $cordovaBarcodeScanner.scan().then(function (imageData) {
        $scope.code = imageData.text;
        var codeData = $scope.code.split(',');
        $scope.selectedCafe.value = $scope.cafes.filter(function (cafe) {
          return cafe.id == codeData[0]
        })[0];
        $scope.table.id = codeData[1];
      }, function (error) {
        console.log('An error happened -> ' + error);
      });
    };


    $scope.submit = function () {
      var option = {
        cafe_id: $scope.selectedCafe.value.id,
        table_id: $scope.table.id,
        card_id: $scope.card.id
      };

      WebApi.tableCheckout(option).then(function (response) {
        $ionicPopup.alert({
          title: 'Success',
          content: response.data.data.message
        });

      }, function (error) {
        $ionicPopup.alert({
          title: 'Error',
          content: error.data.data.message
        });
      });
    }

  });