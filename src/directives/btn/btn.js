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
			link: function($s, $e, attrs) {
				
				$e.addClass('zm-btn');
				$e.on('mousedown', function(event) {
					event.preventDefault();
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