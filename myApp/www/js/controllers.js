angular.module('starter.controllers', [])

  .controller('MyCardsCtrl', function ($scope, BonusCards, CONFIG) {
    $scope.cards = [];
    $scope.defaultLogo = CONFIG.defaultLogoUrl;

    BonusCards.getMyCards().then(function (data) {
      $scope.cards = data.data.items;
    });

    $scope.removeCard = function (card) {
      BonusCards.removeCard(card.id).then(function(){
        $scope.cards.splice($scope.cards.indexOf(card), 1);
      })
    };
  })
  .controller('MyCardDetailCtrl', function ($scope, $stateParams, BonusCards, CONFIG) {
    $scope.card = {};
    $scope.defaultLogo = CONFIG.defaultLogoUrl;

    BonusCards.getCard($stateParams.cardId).then(function (data) {
      $scope.card = data.data;
    });
  })


  .controller('ServicesCtrl', function ($scope, Services) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.services = [];
    Services.getServices().then(function(data){
      $scope.services = data.data.items;
    });

  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });

