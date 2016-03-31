
'use strict';

app.directive('barcodeDirective', function () {
  return {
    restrict: 'EAC',
    scope: {
      currentCode: '='
    },
    template: '<img class="barcode"/>',
    link: function(scope, element) {
      console.log(true);
          scope.$watch('currentCode', function(){
            if (scope.currentCode) {
              var barcodeImg = element.find('.barcode');
              $(barcodeImg).JsBarcode(scope.currentCode);;
            }
          });
    }
  };
});
