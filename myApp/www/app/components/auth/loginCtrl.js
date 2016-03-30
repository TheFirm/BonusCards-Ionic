'use strict';

app.controllers.LoginCtrl = function($scope, AuthService) {

  $scope.getMyLastName = function() {
    AuthService.getMyLastName()
      .then(function(response) {
        $scope.last_name = response.last_name;
      }
    );
  };

};

app.controller('LoginCtrl', app.controllers.LoginCtrl);
