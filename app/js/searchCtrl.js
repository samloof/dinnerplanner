// Search controller that we use whenever we have a search inputs
// and search results
dinnerPlannerApp.controller('SearchCtrl', function ($scope, Dinner, $cookieStore) {

  // TODO in Lab 5: you will need to implement a method that searchers for dishes
  // including the case while the search is still running.

    $scope.errorOccured = false;
    $scope.errorText = "";
    $scope.isLoading = false;

    $scope.search = function (query) {
        $scope.status = "Searching...";
        $scope.isLoading = true;
        if (query != null) {
            $cookieStore.put('searchString', query);
        }
        else {
            $cookieStore.put('searchString', "null");
        }

        Dinner.DishSearch.get({ title_kw: query }, function (data) {
            $scope.dishes = data.Results;

            // Take care of 403 Invalid API Client, 400 API rate limit exceeded etc
            if (data.Results == undefined && data.StatusCode != null) {
                $scope.handleError(data.StatusCode + " " + data.Message);
            }
            else {
                $scope.status = "Showing " + data.Results.length + " results";
                $scope.isLoading = false;
                if (data.Results.length === 0) {
                    $scope.errorText = "No data for that keyword.";
                    $scope.errorOccured = true;
                }
                else {
                    $scope.errorOccured = false; // Don't remove. Case: Search when internet cable unplugged, plug it and search again.
                }
            }
        }, function (data) {
            $scope.handleError("There was an error.");
        });
    }

    $scope.handleError = function (errorMsg) {
        $scope.errorText = errorMsg;
        $scope.status = "";
        $scope.isLoading = false;
        $scope.errorOccured = true;
    }

    $scope.handleKeyPress = function (keyEvent) {
        if (keyEvent.which === 13) {
            $scope.search($scope.query);
        }
    }

    // Display search result when the page is loaded
    if ($cookieStore.get('searchString') == undefined || $cookieStore.get('searchString') == "null") {
        $scope.search(null);
    }
    else {
        $scope.search($cookieStore.get('searchString'));
    }
});