app.run(['$rootScope', '$window',
  function($rootScope, $window) {

    $window.fbAsyncInit = function() {
      FB.init({
        appId: '452734651602347',
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v2.4'
      });
    };

    (function(d){
      var js,
        id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];

      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement('script');
      js.id = id;
      js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";

      ref.parentNode.insertBefore(js, ref);

    }(document));

  }]);
