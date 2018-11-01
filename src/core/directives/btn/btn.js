/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	Zemit.app.run(['$object', function($object) {
		$object.register('btn', 'zm-btn');
	}]);
	
	/**
	 * Creates a button
	 */
	Zemit.app.directive('zmBtn', ['$compile', '$route', function($compile, $route) {
		return {
			restrict: "E",
			templateUrl: 'core/directives/btn/btn.html',
			replace: true,
			transclude: true,
			link: function($s, $e, attrs) {
				
				$s.object = $s.$eval(attrs.object);
				
				$e.on('mousedown', function(event) {
					event.preventDefault();
				});
				
				$e.on('keyup', (event) => {
					
					if(attrs.disabled) {
						return false;
					}
					
					if(event.which === 13) {
						$e.click();
						$s.$apply();
					}
				});
				
				$s.click = () => {
					if(attrs.click) {
						$s.$eval(attrs.click);
						$s.$digest();
					}
					else if($s.object && $s.object.route) {
						$route.gotoRoute($s.object.route);
					}
				};
			}
		};
	}]);
})();