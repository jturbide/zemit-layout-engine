/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Creates a button
	 */
	Zemit.app.directive('zmBtn', [function() {
		return {
			restrict: "E",
			templateUrl: 'core/directives/btn/btn.html',
			replace: true,
			transclude: true,
			link: function($s, $e, attrs) {
				
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
				
				if(attrs.click) {
					$e.on('click touch', function(event) {
						$s.$eval(attrs.click);
						$s.$digest();
					});
				}
			}
		};
	}]);
})();