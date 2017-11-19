/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Switch field
	 */
	Zemit.app.directive('zmFieldTreeview', ['$templateCache', function($templateCache) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				ngModel: '=',
				options: '='
			},
			templateUrl: 'directives/field/treeview/treeview.html',
			link: function ($s, $e, attrs) {
				
				$s.template = attrs.template || 'directives/field/treeview/treeview.default.html';
			}
		}
	}]);
})();