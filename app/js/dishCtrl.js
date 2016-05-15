// Dinner controller that we use whenever we want to display detailed
// information for one dish
dinnerPlannerApp.controller('DishCtrl', function ($scope, $routeParams, Dinner, $location) {
  
  // TODO in Lab 5: you need to get the dish according to the routing parameter
  // $routingParams.paramName
  // Check the app.js to figure out what is the paramName in this case

    $scope.pendingDish = null;
    $scope.errorOccured = true;
    $scope.errorText = "";
    $scope.isLoading = false;

    Dinner.setPendingDish(null); // Important that this is set. Otherwise the pending dish cost will still be included in the total cost when the user leaves the dish view (either via the back buttons or via confirm dish button).

    if ($routeParams.dishId != null) {
        $scope.isLoading = true;
        Dinner.Dish.get({ id: $routeParams.dishId }, function (data) {
            $scope.pendingDish = data;
            $scope.errorOccured = false;

            if (data.StatusCode != null) {
                $scope.errorText = data.StatusCode + " " + data.Message;
                $scope.errorOccured = true;
            }
            else {
                Dinner.setPendingDish($scope.pendingDish);
            }
            $scope.isLoading = false;
        }, function (data) {
            $scope.errorText = "There was an error.";
            $scope.isLoading = false;
        });
    }


    $scope.getTotalDishPrice = function (dish) {
        return Dinner.getDishPrice(dish);
    }

    $scope.addDishToMenu = function () {
        Dinner.addDishToMenu(angular.copy($scope.pendingDish));
        $location.path('/search');
    }

    $scope.goBack = function () {
        $location.path('/search');
    }

});