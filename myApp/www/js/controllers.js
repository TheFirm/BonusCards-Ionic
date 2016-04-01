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
                            $state.go('tab.cards', {}, {reload: true});
                    } else {
                        alert('Facebook login failed');
                    }
                });
        };

    })

    /* MyCardDetailCtrl */
    .controller('MyCardDetailCtrl', function ($scope, $stateParams, BonusCards, CONFIG, LoginService) {
        LoginService.loginCheck();
        $scope.card = {};
        $scope.defaultLogo = CONFIG.defaultLogoUrl;

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

    /* CardCreateCtrl */
    .controller('CardCreateCtrl', function ($scope, $stateParams, LoginService) {
        LoginService.loginCheck();
        //$scope.chat = Chats.get($stateParams.serviceId);
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
                alert('Facebook error: ' + error.error_description);
            });

        $scope.logout = function () {
            localStorage.clear();
            $state.go('login', {}, {reload: true})
        };
    })

    .controller('AccountCtrl', function ($scope, LoginService) {
        LoginService.loginCheck();

        $scope.settings = {
            enableFriends: true
        };
    });



