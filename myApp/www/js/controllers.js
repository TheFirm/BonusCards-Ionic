angular.module('starter.controllers', [])

  .controller('MyCardsCtrl', function ($scope, BonusCards, CONFIG) {
    $scope.cards = [];
    $scope.defaultLogo = CONFIG.defaultLogoUrl;

    BonusCards.getMyCards().then(function (data) {
      $scope.cards = data.data.items;
    });
  })
  .controller('MyCardDetailCtrl', function ($scope, $stateParams, BonusCards, CONFIG) {
    $scope.card = {};
    $scope.defaultLogo = CONFIG.defaultLogoUrl;

    BonusCards.getCard($stateParams.cardId).then(function (data) {
      $scope.card = data.data;
    });
  })








  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });

