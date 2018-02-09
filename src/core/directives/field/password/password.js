/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Switch field
	 */
	Zemit.app.directive('zmFieldPassword', [function() {
		return {
			restrict: 'E',
			scope: {
				ngModel: '=',
				ngDisabled: '=?',
				autofocus: '=?'
			},
			templateUrl: 'core/directives/field/password/password.html',
			link: function ($s, $e, attrs) {
				
				$s.attrs = attrs;
			}
		}
	}]);
})();