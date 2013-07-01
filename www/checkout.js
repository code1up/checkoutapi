angular.module("checkout", [ "firebase" ]).
  value("fireBaseUrl", "https://checkoutapi.firebaseio.com/").
  factory("Items", function(angularFireCollection, fireBaseUrl) {
    return angularFireCollection(fireBaseUrl);
  }).
  config(function($routeProvider) {
    $routeProvider.
    when("/", {
      controller: BasketController,
      templateUrl: "basket.html"
    }).
    otherwise({
      redirectTo:"/"
    });
});
 
function BasketController($scope, Items) {
  $scope.items = Items;
}
