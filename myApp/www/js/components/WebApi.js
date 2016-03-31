app.factory('WebApi', function ($http) {
  var API_URL = 'http://barcode-api.loc/v1/';
  var options = {
    headers: {
      'Authorization': 'Bearer 123',
      'Content-Type': 'application/json'
    }
  };

  function login(opt) {
    var data = {
      facebook_user_id: opt.facebook_user_id,
      name: opt.name
    };

    return $http.post(API_URL + 'user/auth', data);
  }

  /* Start. Bonus Cards */
  function myCards() {
    return $http.get(API_URL + 'bonus-card/my-cards?page=1', options);
  }

  function viewCard(id) {
    return $http.get(API_URL + 'bonus-cards/' + id, options);
  }

  function removeCard(id) {
    return $http.delete(API_URL + 'bonus-cards/' + id, options);
  }
  /* End. Bonus Cards */


  return {
    login: login,
    myCards: myCards,
    viewCard: viewCard,
    removeCard: removeCard
  }
})
;
