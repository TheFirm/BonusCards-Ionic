app.factory('WebApi', function ($http) {
  var API_URL = 'http://bonuscards.relevant.software/v1/';
  var options = {
    headers: {
      'Authorization': 'Bearer BSQgxuRuzNJbtSO-mkn24f13_fe0FF6y',
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


  function getServices() {
    return $http.get(API_URL + 'services', options);
  }


  return {
    login: login,
    myCards: myCards,
    viewCard: viewCard,
    removeCard: removeCard,
    getServices: getServices
  }
});
