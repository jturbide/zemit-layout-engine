/**
 * Zemit Route
 * @author: <contact@dannycoulombe.com>
 * 
 * Declare routes withing the application
 */
(function() {
	
	Zemit.app.run(['$route', '$location', '$routeParams', '$filter', '$i18n', '$rootScope', function($route, $location, $routeParams, $filter, $i18n, $rs) {
		
		$rs.$on('$routeChangeStart', function(event, next, current) {
			
			if(next) {
				document.title = $i18n.get('route.' + $route.getRouteName(next) + '.title');
			}
		});
		
		$route.getRouteName = function(route) {
			return route && route.$$route && route.$$route.name;
		};
		
		$route.getCurrentRoute = function() {
			return $route.current;
		};
		
		$route.getCurrentRouteName = function() {
			return $route.getRouteName($route.getCurrentRoute());
		};
		
		$route.gotoRoute = function(name, params, queryParams) {
			
			let substring = $location.$$html5 ? 0 : 2;
			
			var path = $filter('toRoute')(name, params).substring(substring);
			var location = $location.path(path);
			
			if(queryParams) {
				location.search(queryParams);
			}
		};
		
		$route.isRoute = function(name, params) {
			
			let route = $route.getCurrentRoute();
			let isRoute = route ? route.name === name : false;
			
			if(isRoute && params) {
				
				let i = 0;
				let p = [];
				
				if(typeof params === 'string') {
					p = params.split('/');
				}
				else if(typeof params === 'object') {
					for(let key in params) {
						p.push(params[key]);
					}
				}
				
				let currentParams = $route.current.params;
				for(let key in route.keys) {
					
					let c = currentParams[route.keys[key].name];
					
					if(c !== p[i]) {
						return false;
					}
					
					i++;
				}
			}
			
			return isRoute;
		};
		
		$route.toRoute = function(name, attrs) {
			
			let prefix = $location.$$html5 ? '' : '#!';
			
			let routeKeys = Object.keys($route.routes);
			let routeName = routeKeys.find(path => {
				return $route.routes[path].name === name;
			});
			
			if(routeName) {
				
				let route = $route.routes[routeName];
				
				let dp = route.default_params || {};
				let path = route.originalPath;
				let params = attrs || $routeParams;
				  
				if(typeof params === 'string') {
					params = params.split('/');
					
					let i = 0;
					for(let key in route.keys) {
						let name = route.keys[key].name;
						path = path.replace(':' + name, params[i] || dp[name]);
						i++;
					}
				}
				else if(typeof params === 'object') {
					for(let key in route.keys) {
						let name = route.keys[key].name;
						path = path.replace(':' + name, params[name] || dp[name]);
					}
				}
				  
				return prefix + path;
			}
			  
			return prefix + name;
		};
	}]);
	
	Zemit.app.filter('toRoute', function($route) {
		
		var toRoute = function(name, attrs) {
			return $route.toRoute(name, attrs);
		};
		toRoute.$stateful = true;
		return toRoute;
	});
})();