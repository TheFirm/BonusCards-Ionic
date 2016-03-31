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
