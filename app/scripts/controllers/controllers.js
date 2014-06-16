'use strict';


var app = angular.module('tphero',	['tphero.directives', 'tphero.services', 'ngRoute']);



// =============================================================
// Routes - Set up our mappings between URLs, templates, and controllers
// =============================================================
app.config(function tabRouteConfig($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'ListCtrl',
			resolve: {
				shortcuts: ["MultiShortcutLoader", function(MultiShortcutLoader) {
					return MultiShortcutLoader();
				}]
			},
			templateUrl:'views/list.html'
		})
	
		.when('/group/:groupName', {
			controller: 'ListCtrl',
			resolve: {
				shortcuts: ["MultiShortcutLoader", function(MultiShortcutLoader) {
					return MultiShortcutLoader();
				}]
			},
			templateUrl:'views/list.html'
		})
		
		.otherwise({
			redirectTo: '/'
		});
});



// =============================================================
// Controllers
// =============================================================
app.controller('ListCtrl', ['$scope', '$location', '$window', 'shortcuts', 'Shortcut', 'MultiShortcutLoader',
		function($scope, $location, $window, shortcuts, Shortcut, MultiShortcutLoader) {

	$scope.shortcuts		= shortcuts;
	$scope.shortcutSelected	= null;
	$scope.shortcutChanged	= null;
			
	$scope.settings = {
		isEditModeActive : false
	}

	// =============================================================
    $scope.newEmptyShortcut = function() {		
        var newShortcut = new Shortcut({
			"_id": 			""
			, "userID": 	""
			, "title": 		""
			, "groupName": 	""
			, "linkURL": 	""
			, "iconURL": 	""
		});
        return newShortcut;
	}
	
    // =============================================================
	$scope.toggleEditMode = function() {
		$scope.settings.isEditModeActive = !$scope.settings.isEditModeActive;
		
		/*
		if ($scope.settings.isEditModeActive) {
		}
		*/
	}

    // =============================================================
	$scope.copyShortcut = function(originalShortcut) {
		var newShortcut = new Shortcut({
			"_id"		: originalShortcut._id
			, "userID"	: originalShortcut.userID
			, "title"	: originalShortcut.title
			, "groupName": originalShortcut.groupName
			, "linkURL"	: originalShortcut.linkURL
			, "iconURL"	: originalShortcut.iconURL
		})
		return newShortcut;
	}	
    
    // =============================================================
	$scope.refreshList = function(){
        //$scope.shortcuts     = MultiShortcutLoader();
        MultiShortcutLoader().then(
			function(results) {
				$scope.shortcuts = results;
			}
		);
    }
	
	// =============================================================
	$scope.edit = function(shortcut, $event) {
		$event.stopPropagation();	// Prevent the click from triggering a click on the wrapper.
		
		
		// Get the selected shortcut
		if (shortcut != null) {
			// Edit an existing one
			$scope.shortcutSelected = shortcut;
			console.log('existing', $scope.shortcutSelected);
		} else {
			// Create a new one
			$scope.shortcutSelected = $scope.newEmptyShortcut();
			console.log('new', $scope.shortcutSelected);
		}

		// Make a copy: All changes will be made to the selected copy 
		$scope.shortcutChanged = $scope.copyShortcut($scope.shortcutSelected);
		
		$('#editShortcutModal').modal('show');

		//$location.path('/detail/'+ shortcut.id);
	}

	// =============================================================
	$scope.editSave = function() {
		$scope.shortcutSelected.userID  = $scope.shortcutChanged.userID;
		$scope.shortcutSelected.title   = $scope.shortcutChanged.title;
		$scope.shortcutSelected.groupName = $scope.shortcutChanged.groupName;
		$scope.shortcutSelected.linkURL = $scope.shortcutChanged.linkURL;
		$scope.shortcutSelected.iconURL = $scope.shortcutChanged.iconURL;
	
		
        var isNewShortcut = $scope.shortcutSelected._id == "";
		
		if (isNewShortcut) {
			console.log('CREATING shortcut: ', $scope.shortcutSelected);
		} else {
			console.log('UPDATING shortcut: ', $scope.shortcutSelected);
		}

		$scope.shortcutSelected.$save().then(
			function(result) { 
				console.log('Saved to DB', result);
				$scope.refreshList();
			}
			, function(result) {
				console.warn('Error saving to DB', result);
			}
		);
					 

		//$scope.shortcutSelected.$save(function() { console.log('saved!!!!!!!');});
        
		$scope.shortcutChanged 	= $scope.newEmptyShortcut();
    }

	// =============================================================
	$scope.editCancel = function() {
		console.log('cancelled edit');
		$scope.shortcutSelected = $scope.newEmptyShortcut();
		$scope.shortcutChanged 	= $scope.newEmptyShortcut();
	}

	
	// =============================================================
	$scope.debugInfo = function(shortcut, $event) {
		$event.stopPropagation();	// Prevent the click from triggering a click on the wrapper.
		console.log('-------------');
		console.log(shortcut);
		return false;
	}

	
	
	// =============================================================
	$scope.delete = function(shortcut, $event) {
		$event.stopPropagation();	// Prevent the click from triggering a click on the wrapper.
		
		console.log('delete', shortcut.$delete);
		
		
		// Delete this record from the shortcut array
		angular.forEach($scope.shortcuts, function(value, key) { 
			if (value === shortcut) {
				console.log('found', value);
				$scope.shortcuts.splice(key, 1);		
			}
		});
		
		// Update the data model 
		shortcut.$delete();
		
		/*
        console.log('delete2', Shortcut.deleteEntity);
        var deletePromise = myDataService.deleteEntity(shortcut._id);
        
        
        deletePromise.then(
            // Success
            function(response) {
                console.log('delete success');
                $scope.refreshList();
            },
            // Fail
            function(response) {
                console.error('Could not delete this item');
            }
        )
        */
		
		//shortcut.$delete(function(test) { console.log(test);});
        //shortcut.$delete({_id :shortcut._id}, null, function() { console.log('test'); });
        
	}

	// =============================================================
	$scope.goto = function(shortcut) {
		console.log('goto', shortcut);
		$window.location.href = shortcut.linkURL;
	}

	// =============================================================
	$scope.getStyle = function(shortcut) {
		var returnStyle = {'background-color': '#7AC'};

		if (typeof(shortcut.iconURL) != 'undefined' && shortcut.iconURL.length > 0) {
			returnStyle = {
				'background-image': 'url('+ shortcut.iconURL +')'
				, 'background-repeat': 'no-repeat'
				, 'background-size': '100% auto'
				, 'background-position': 'center'
			};
		}

		return returnStyle;
	}
}]);





//var shortcuts = {};


/*
app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {
				controller: 'ListCtrl',
				resolve: {
					recipes: ["MultiRecipeLoader", function(MultiRecipeLoader) {
						return MultiRecipeLoader();
					}]
				},
				templateUrl:'/views/list.html'
			}).when('/edit/:recipeId', {
				controller: 'EditCtrl',
				resolve: {
					recipe: ["RecipeLoader", function(RecipeLoader) {
						return RecipeLoader();
					}]
				},
				templateUrl:'/views/recipeForm.html'
			}).when('/view/:recipeId', {
				controller: 'ViewCtrl',
				resolve: {
					recipe: ["RecipeLoader", function(RecipeLoader) {
						return RecipeLoader();
					}]
				},
				templateUrl:'/views/viewRecipe.html'
			}).when('/new', {
				controller: 'NewCtrl',
				templateUrl:'/views/recipeForm.html'
			}).otherwise({redirectTo:'/'});
}]);

app.controller('ListCtrl', ['$scope', 'recipes',
		function($scope, recipes) {
	$scope.recipes = recipes;
}]);

app.controller('ViewCtrl', ['$scope', '$location', 'recipe',
		function($scope, $location, recipe) {
	$scope.recipe = recipe;

	$scope.edit = function() {
		$location.path('/edit/' + recipe.id);
	};
}]);

app.controller('EditCtrl', ['$scope', '$location', 'recipe',
		function($scope, $location, recipe) {
	$scope.recipe = recipe;

	$scope.save = function() {
		$scope.recipe.$save(function(recipe) {
			$location.path('/view/' + recipe.id);
		});
	};

	$scope.remove = function() {
		delete $scope.recipe;
		$location.path('/');
	};
}]);

app.controller('NewCtrl', ['$scope', '$location', 'Recipe',
		function($scope, $location, Recipe) {
	$scope.recipe = new Recipe({
		ingredients: [ {} ]
	});

	$scope.save = function() {
		$scope.recipe.$save(function(recipe) {
			$location.path('/view/' + recipe.id);
		});
	};
}]);

app.controller('IngredientsCtrl', ['$scope',
		function($scope) {
	$scope.addIngredient = function() {
		var ingredients = $scope.recipe.ingredients;
		ingredients[ingredients.length] = {};
	};
	$scope.removeIngredient = function(index) {
		$scope.recipe.ingredients.splice(index, 1);
	};
}]);

*/

