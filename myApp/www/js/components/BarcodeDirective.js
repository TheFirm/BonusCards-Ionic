
'use strict';

app.directive('barcodeDirective', function ($timeout) {
  return {
    restrict: 'EAC',
    scope: {
      barcodeDirective: '='
    },
    link: function(scope, element) {
        scope.$watch('barcodeDirective', function(){
          if (scope.barcodeDirective) {
            JsBarcode("#barcode", scope.barcodeDirective);
          }
        });
    }
  };
});
