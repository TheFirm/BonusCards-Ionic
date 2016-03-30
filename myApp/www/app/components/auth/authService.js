'use strict';
app.factories.AuthService = function() {

  var self = this;

  self.getMyLastName = function() {
    var deferred = $q.defer();
    FB.api('/me', {
      fields: 'last_name'
    }, function(response) {
      if (!response || response.error) {
        deferred.reject('Error occured');
      } else {
        deferred.resolve(response);
      }
    });
    return deferred.promise;
  };

  return self;

};

app.factory('AuthService', app.factories.AuthService);
