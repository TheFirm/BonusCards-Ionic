app.factory('WebApi', function ($http) {
  var API_URL = 'http://bonuscards.relevant.software/v1/';
  var options = {
    headers: {
      'Authorization': 'Bearer ' + window.localStorage.tokenApi,
      'Content-Type': 'application/json'
    }
  };

  function login(opt) {
    var data = {
      facebook_user_id: opt.id,
      name: opt.name
    };

    return $http.post(API_URL + 'user/auth', data);
  }

  /* Add Bonus Cards */
  function myCards() {
    return $http.get(API_URL + 'bonus-card/my-cards?page=1', options);
  }

  /* Start. Bonus Cards */
  function addCard(data) {
    return $http.post(API_URL + 'bonus-cards',data, options);
  }

  function viewCard(id) {
    return $http.get(API_URL + 'bonus-cards/' + id, options);
  }

  function removeCard(id) {
    return $http.delete(API_URL + 'bonus-cards/' + id, options);
  }

  /* End. Bonus Cards */


  function getServices() {
    return $http.get(API_URL + 'services', options);
  }


  return {
    login: login,
    myCards: myCards,
    viewCard: viewCard,
    removeCard: removeCard,
    getServices: getServices,
    addCard: addCard
  }
});
