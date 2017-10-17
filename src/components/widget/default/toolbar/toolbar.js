/**
 * Widget toolbar
 * 
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * 
	 */
	Zemit.app.directive('zmToolbarWidget', [function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'components/widget/default/toolbar/toolbar.html',
			link: function ($s, $e, attrs) {
				
				
			}
		};
	}]);
})();