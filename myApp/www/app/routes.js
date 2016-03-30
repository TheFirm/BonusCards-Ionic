app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/404');

  $urlRouterProvider.when('/', function ($state) {
    $state.go('login');
  });

  $stateProvider
    .state('login', {
      url: '/login',
      controller: 'LoginCtrl',
      templateUrl: '/app/components/auth/login.html'
    })
    .state('404', {
      url: '/404',
      template: '<p>Hello, world!</p>'
    })
});
