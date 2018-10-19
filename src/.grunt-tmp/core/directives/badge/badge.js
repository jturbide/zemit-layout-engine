/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * General directives
	 */
	Zemit.app.directive('zmBadge', [function() {
		return {
			restrict: 'AE',
			link: function ($s, $e, attrs) {
				
				$e.addClass('zm-badge');
			}
		};
	}]);
})();