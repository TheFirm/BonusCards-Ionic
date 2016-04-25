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
  .controller('ServicesCtrl', function ($scope, Services, LoginService, serviceList) {
    LoginService.loginCheck();
    $scope.services = serviceList;
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

  .controller('ProfileCtrl', function ($scope, ngFB, $state, LoginService, $ionicPopup, $ionicLoading) {
    LoginService.loginCheck();
    $ionicLoading.show();
    ngFB.api({
      path: '/me',
      params: {fields: 'id,name'}
    }).then(
      function (user) {
        $ionicLoading.hide();
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
    $scope.isFestCard = $stateParams.isFestCard;
    if($scope.currentServiceId == 1){
      $scope.isFestCard = true;
    }
    $scope.card = {
      barcode: null,
      name: null,
      password: null
    };

    $scope.onTabSelected = function() {
      $state.go('tab.services');
    };

    $scope.scanBarcode = function () {
      $cordovaBarcodeScanner.scan().then(function (imageData) {
        $scope.card.barcode = imageData.text;
        console.log("Barcode Format -> " + imageData.format);
        console.log("Cancelled -> " + imageData.cancelled);
      }, function (error) {
        console.log("An error happened -> " + error);
      });
    };

    $scope.submit = function () {
      var option = {
          name: $scope.card.name,
          service_id: $stateParams.serviceId,
          code: $scope.card.barcode,
          password: $scope.card.password
        };

      WebApi.addCard(option).then(function (response) {
        $scope.card.barcode = $scope.card.name = '';

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
  .controller('CheckinCtrl', function ($scope, LoginService, cardsList, $cordovaBarcodeScanner, WebApi, $ionicPopup,
                                       $ionicScrollDelegate, $timeout)  {
    LoginService.loginCheck();
    $scope.selectedCafe = {value : null};
    $scope.table = {id : null};

    /* Get first !fest card data */
    if(cardsList.data.items){
      $scope.card = cardsList.data.items.filter(function (card) {
        return card.service && card.service.id == 1;
      })[0];
    }

    WebApi.getCafes().then(function (response) {
      $scope.cafes = response.data.data;
    });

    var showManualBlock = false;
    $scope.toggleManualBlock = function () {
      showManualBlock = !showManualBlock;
      $timeout(function(){
        $ionicScrollDelegate.resize();
      },50)
    };
    $scope.showManualBlock = function () {
      return showManualBlock
    };


    $scope.scanBarcode = function () {
      $cordovaBarcodeScanner.scan().then(function (imageData) {
        $scope.code = imageData.text;
        var codeData = $scope.code.split(',');
        var isValidCode = codeData.every(function (data) {
          return !isNaN(data)
        });

        if(isValidCode){
          $scope.selectedCafe.value = $scope.cafes.filter(function (cafe) {
            return cafe.id == codeData[0]
          })[0];
          $scope.table.id = codeData[1];
          $scope.submit();
        }
        else{
          $ionicPopup.alert({
            title: 'Error',
            content: 'QR code invalid'
          });
        }


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