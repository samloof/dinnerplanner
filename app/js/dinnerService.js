// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
dinnerPlannerApp.factory('Dinner', function ($resource, $cookieStore) {
  
    // Sets number of guests
    this.setNumberOfGuests = function(num) {
        numberOfGuest = num;
        $cookieStore.put('numberOfGuest', numberOfGuest);
    }

    // Returns number of guests
    this.getNumberOfGuests = function() {
        return numberOfGuest;
    }

    // Returns the initial value for number of guests.
    this.initNumberOfGuest = function () {
        if ($cookieStore.get('numberOfGuest') != undefined) {
            return $cookieStore.get('numberOfGuest');
        }
        return 2;
    }

  // TODO in Lab 5: Add your model code from previous labs
  // you will need to modify the model (getDish and getAllDishes)
  // a bit to take the advantage of Angular resource service
  // check lab 5 instructions for details
    
    var numberOfGuest = this.initNumberOfGuest();
    var selectedDishes = [];
    var pendingDish = null;
    var apiKey = "YOUR_API_KEY_HERE";
    var numberOfDishes = 20;

    this.DishSearch = $resource('http://api.bigoven.com/recipes', { pg: 1, rpp: numberOfDishes, api_key: apiKey }, { get: { method: "GET", cache: true } });
    this.Dish = $resource('http://api.bigoven.com/recipe/:id', { api_key: apiKey }, { get: { method: "GET", cache: true } });
    
    // Sets the pending dish.
    this.setPendingDish = function (dish) {
        pendingDish = dish;
    }

    // Gets the pending dish.
    this.getPendingDish = function () {
        return pendingDish;
    }
    
    // Returns all the dishes on the menu.
    this.getFullMenu = function () {
        return selectedDishes;
    }
    
    // Returns the price of the dish (all the ingredients multiplied by number of guests).
    this.getDishPrice = function (dish) {
        var costForDishAllPeople = 0;

        if (dish == null || dish.StatusCode != undefined) {
            return 0;
        }
        for (var i = 0; i < dish.Ingredients.length; i++) {
            costForDishAllPeople += dish.Ingredients[i].Quantity * this.getNumberOfGuests();
        }
        return costForDishAllPeople;
    }

    // Returns the total price of the menu (all the ingredients multiplied by number of guests).
    this.getTotalMenuPrice = function () {
        var priceOnePerson = 0;
        for (var i = 0; i < selectedDishes.length; i++) {
            for (var j = 0; j < selectedDishes[i].Ingredients.length; j++) {
                priceOnePerson += selectedDishes[i].Ingredients[j].Quantity;
            }
        }
        return numberOfGuest * priceOnePerson;
    }

    // Returns the total price of the menu plus the pending price (all the ingredients and the pending price multiplied by number of guests).
    this.getTotalMenuPriceWithPendingPrice = function () {
        return this.getTotalMenuPrice() + this.getDishPrice(pendingDish);
    }

    // Adds a dish to the menu.
    this.addDishToMenu = function (dish) {
        selectedDishes.push(dish);
        this.storeDinnerMenuInCookie();
    }

    // Removes dish from menu.
    this.removeDishFromMenu = function (id) {
        for (var i = 0; i < selectedDishes.length; i++) {
            if (selectedDishes[i].RecipeID == id) {
                selectedDishes.splice(i, 1);
                break;
            }
        }
        this.storeDinnerMenuInCookie();
    }

    // Adds the recipe ids for the dishes on the menu to a cookie.
    this.storeDinnerMenuInCookie = function () {
        var recipeIds = [];
        for (var i = 0; i < selectedDishes.length; i++) {
            recipeIds.push(selectedDishes[i].RecipeID);
        }
        $cookieStore.put('dinnerMenu', recipeIds);
    }

    // Retrieves the initial dinner menu.
    this.initDinnerMenu = function () {
        var recipeIds = $cookieStore.get('dinnerMenu');

        if (recipeIds != undefined) {
            for (var i = 0; i < recipeIds.length; i++) {
                this.Dish.get({ id: recipeIds[i] }, function (data) {
                    if (data.StatusCode == null) {
                        selectedDishes.push(data);
                    }
                }, function (data) {
                    console.log("Failed to retrieves dish with id " + recipeIds[i] + ".");
                });
            }
        }
    }

    // Returns true if the dinner menu is empty and otherwise false.
    this.dinnerMenuIsEmpty = function () {
        if (selectedDishes == null || selectedDishes.length == 0) {
            return true;
        }
        return false;
    }

    // Gets the number of dishes that is used when making a dish search.
    this.getNumberOfDishes = function () {
        return numberOfDishes;
    }

    // Sets the number of dishes that is used when making a dish search.
    this.setNumberOfDishes = function (numDishes) {
        numberOfDishes = numDishes;
        // Important that the query string is rebuilt in order to fetch the correct number of dishes.
        this.DishSearch = $resource('http://api.bigoven.com/recipes', { pg: 1, rpp: numberOfDishes, api_key: apiKey }, { get: { method: "GET", cache: true } });
    }

    this.initDinnerMenu();

  // Angular service needs to return an object that has all the
  // methods created in it. You can consider that this is instead
  // of calling var model = new DinnerModel() we did in the previous labs
  // This is because Angular takes care of creating it when needed.
  return this;

});