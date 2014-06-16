'use strict';

var services = angular.module('tphero.services', ['ngResource']);

/*==========  Resource: Shortcut  ==========*/
services.factory('Shortcut', ['$resource',
	function($resource) {
		return $resource('/Shortcuts/:_id', {_id: '@_id'});
	}
]);


/*==========Loader: Multi Shortcut==========*/
services.factory('MultiShortcutLoader', ['Shortcut', '$route', '$q',
	function(Shortcut, $route, $q) {
		return function() {
		var delay = $q.defer();
			
			
			var selectedGroup = $route.current.params.groupName;
			var queryObj = {};
			if (typeof(selectedGroup) != 'undefined') {
				queryObj = {"groupName": selectedGroup};
			}
			
			console.log('group name', queryObj);

			Shortcut.query(queryObj, function(Shortcuts) {
			delay.resolve(Shortcuts);
		
		} , function() {
			delay.reject('Unable to fetch Shortcuts');
		});
		
		return delay.promise;
		};
	}
]);


/*==========Loader: Single Shortcut==========*/
services.factory('ShortcutLoader', ['Shortcut', '$route', '$q',
	function(Shortcut, $route, $q) {
		return function() {
		var delay = $q.defer();
		
		// Get ----------
		Shortcut.get(
			{id: $route.current.params.id}
			, function(Shortcut) {
				delay.resolve(Shortcut);

			}, function() {
				delay.reject('Unable to fetch Shortcut '+ $route.current.params.id);
			}
		);

		return delay.promise;
		};
	}
								 
									
]);



/*==========myShortcutDataService==========*/
services.factory('myDataService',  
	function($log, $q, $resource, Shortcut) {
		return {
			deleteEntity: function(entityID) {
				var delay = $q.defer();
				
				console.log('Being asked to delete '+ entityID);

				Shortcut.delete(
					{ _id: entityID }				
					, function(response) {
						console.log('Resolving'.green);
						delay.resolve(response)
					}
					, function(response) {
						console.log('Rejecting'.red);
						delay.reject(response)
					}
				
				);
			
				return delay.promise;
			}
		}
})


/*
services.factory('Recipe', ['$resource',
  function($resource) {
	return $resource('/recipes/:id', {id: '@id'});
  }
]);

services.factory('MultiRecipeLoader', ['Recipe', '$q',
  function(Recipe, $q) {
	return function() {
	  var delay = $q.defer();

	  Recipe.query(function(recipes) {
		delay.resolve(recipes);
	  
	  } , function() {
		delay.reject('Unable to fetch recipes');
	  });
	
	  return delay.promise;
	};
  }
]);

services.factory('RecipeLoader', ['Recipe', '$route', '$q',
  function(Recipe, $route, $q) {
	return function() {
	  var delay = $q.defer();

	  Recipe.get({id: $route.current.params.recipeId}, function(recipe) {
		delay.resolve(recipe);
		
	  }, function() {
		delay.reject('Unable to fetch recipe '  + $route.current.params.recipeId);
	  });
	  return delay.promise;
	};
  }
]);
*/