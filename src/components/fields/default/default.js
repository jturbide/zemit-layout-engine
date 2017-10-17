/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Switch field
	 */
	Zemit.app.directive('zmField', [function() {
		return {
			restrict: 'E',
			replace: true,
			//templateUrl: 'components/fields/switch/switch.html',
			link: function ($s, $e, attrs) {
				
				$e.addClass('zm-field');
			}
		}
	}]);
})();