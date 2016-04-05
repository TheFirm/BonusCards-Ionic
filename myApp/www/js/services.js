angular.module('starter.services', [])

  /* Services */
  .factory('Services', function (WebApi, $q) {
    function getServices() {
      var promise = $q.defer();

      WebApi.getServices().then(function (response) {
        promise.resolve(response.data);
      }, function (error) {
        console.log('Get services:', +error);
        promise.reject(error);
      });

      return promise.promise;
    }

    return {
      getServices: getServices
    };
  });

/* LoginService Cards */
app.factory('LoginService', function (WebApi, $q, ngFB, $state, $location, $window) {
  function afterLogin() {
    var promise = $q.defer();
    ngFB.api({
      path: '/me',
      params: {fields: 'id,name'}
    }).then(
      function (user) {
        WebApi.login(user).then(function (response) {
          window.localStorage.tokenApi = response.data.data.access_token;
          $location.path('#/tab/cards');
          $window.location.reload();
        }, function (error) {
          console.log('Get auth token:', +error);
          promise.reject(error);
        });
      },
      function (error) {
        console.log( error);
      });
  }

  function isLogged() {
    if (window.localStorage.tokenApi && ngFB.getLoginStatus().$$state.value.status == 'connected') {
      return true;
    }

    return false;
  }

  function loginCheck() {

    //ngFB.api({
    //  path: '/me',
    //  params: {fields: 'id,name'}
    //}).then(
    //  function (user) {
    //  },
    //  function (error) {
    //    window.localStorage.clear();
    //  });

    if (!window.localStorage.tokenApi || ngFB.getLoginStatus().$$state.value.status != 'connected' ) {

      window.localStorage.clear();
      $state.go('login', {}, {reload: true});
    }
  }

  return {
    afterLogin: afterLogin,
    isLogged: isLogged,
    loginCheck: loginCheck
  };
});

/* Bonus Cards */
app.factory('BonusCards', function (WebApi, $q) {

  function getMyCards() {
    var promise = $q.defer();

    WebApi.myCards().then(function (response) {
      promise.resolve(response.data);
    }, function (error) {
      console.log('Get cards:', +error);
      promise.reject(error);
    });

    return promise.promise;
  }

  function getCard($id) {
    var promise = $q.defer();

    WebApi.viewCard($id).then(function (response) {
      promise.resolve(response.data);
    }, function (error) {
      promise.reject(error);
    });

    return promise.promise;
  }

  function removeCard(id) {
    var promise = $q.defer();

    WebApi.removeCard(id).then(function (response) {
      promise.resolve(response.data);
    }, function (error) {
      promise.reject(error);
    });

    return promise.promise;
  }

  return {
    getCard: getCard,
    getMyCards: getMyCards,
    removeCard: removeCard
  };
});

app.service('CardHelper', function (CONFIG) {
  this.getCardLogo = function (card) {
    return card.service ? card.service.logo_url : CONFIG.defaultLogoUrl;
  };
});
