/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Switch field
	 */
	Zemit.app.directive('zmFieldEmail', [function() {
		return {
			restrict: 'E',
			scope: {
				ngModel: '=',
				ngDisabled: '=?',
				autofocus: '=?'
			},
			templateUrl: 'core/directives/field/email/email.html',
			link: function ($s, $e, attrs) {
				
				$s.attrs = attrs;
			}
		}
	}]);
})();