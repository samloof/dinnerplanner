// Dinner controller that we use whenever we have view that needs to 
// display or modify the dinner menu
dinnerPlannerApp.controller('DinnerCtrl', function ($scope, Dinner, $location) {

  $scope.numberOfGuests = Dinner.getNumberOfGuests();

  $scope.setNumberOfGuest = function(number){
    Dinner.setNumberOfGuests(number);
  }

  $scope.getNumberOfGuests = function() {
    return Dinner.getNumberOfGuests();
  }

  // TODO in Lab 5: Implement the methods to get the dinner menu
  // add dish to menu and get total menu price

  $scope.getDinnerMenu = function () {
      return Dinner.getFullMenu();
  }

  $scope.getTotalMenuPrice = function () {
      return Dinner.getTotalMenuPrice();
  }

  $scope.getTotalMenuPriceWithPendingPrice = function () {
      return Dinner.getTotalMenuPriceWithPendingPrice();
  }

  $scope.confirmDinner = function () {
      $location.path('/overview');
  }

  $scope.dinnerMenuIsEmpty = function () {
      return Dinner.dinnerMenuIsEmpty();
  }

  $scope.removeDishFromMenu = function (recipeID) {
      Dinner.removeDishFromMenu(recipeID);
  }


  $scope.dinnerMenu = $scope.getDinnerMenu();
  $scope.dinnerMenuIsEmpty();
});