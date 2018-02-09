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
			scope: {
				scope: '=',
				list: '=',
				options: '='
			},
			templateUrl: 'core/directives/field/treeview/treeview.html',
			link: function ($s, $e, attrs) {
				
				$s.depth = 0;
				$s.parent = $s.list;
				$s.defaultTemplate = 'core/directives/field/treeview/treeview.default.html';
				$s.defaultLvlOptions = 'core/directives/field/treeview/treeview.options.html';
				$s.defaultLvlToolbar = 'core/directives/field/treeview/treeview.toolbar.html';
				$s.defaultLvlBefore = 'core/directives/field/treeview/treeview.before.html';
				$s.defaultLvlAfter = 'core/directives/field/treeview/treeview.after.html';
				
				$s.count = function(node, parent, depth) {
					
					return $s.options.levels[depth].getList(node).length;
				};
			}
		}
	}]);
})();