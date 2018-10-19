/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	Zemit.app.run(['$session', function($session) {
		$session.prepare('settings', {
			treeview: {}
		});
	}]);
	
	/**
	 * Switch field
	 */
	Zemit.app.directive('zmFieldTreeview', ['$timeout', '$filter', '$session', function($timeout, $filter, $session) {
		return {
			restrict: 'E',
			scope: {
				list: '=',
				options: '=',
				scope: '=?',
				filterScope: '=?filter'
			},
			templateUrl: 'core/directives/field/treeview/treeview.html',
			link: function ($s, $e, attrs) {
				
				$s.depth = 0;
				$s.visible = true;
				$s.parent = $s.list;
				$s.parentList = $s.list;
				$s.defaultTemplate = 'core/directives/field/treeview/treeview.default.html';
				$s.defaultLvlOptions = 'core/directives/field/treeview/treeview.options.html';
				$s.defaultLvlToolbar = 'core/directives/field/treeview/treeview.toolbar.html';
				$s.defaultLvlBefore = 'core/directives/field/treeview/treeview.before.html';
				$s.defaultLvlAfter = 'core/directives/field/treeview/treeview.after.html';
				$s.settings = $session.get('settings');
				
				$s.addCallback = function(list, index) {
					return function(key, title, data, childs = []) {
						
						list.splice(index, 0, {
							key: key,
							title: title,
							data: data,
							childs: childs
						});
						
						// Open by default
						$s.settings.treeview[key] = true;
						
						$s.$digest();
					};
				};
				
				$s.editCallback = function(node) {
					return function(key, title, data, childs) {
						
						angular.extend(node, {
							key: key || node.key,
							title: title || node.title,
							data: data || node.data,
							childs: childs || node.childs
						});
						
						$s.$digest();
					};
				};
				
				$s.toggle = function(nodeSettings, node, event) {
					
					nodeSettings.viewItems = !nodeSettings.viewItems;
					
					let $target = angular.element(event.target).parent();
					let $scrollContainer = $target.parents('.zm-scrollable-y:eq(0)');
					if($scrollContainer.length === 0) {
						$scrollContainer = angular.element('body');
					}
					
					let top = ($target.offset().top - $scrollContainer.offset().top);
					
					$s.settings.treeview[node.key] = nodeSettings.viewItems;
					
					$scrollContainer.animate({
						scrollTop: top
					}, 250);
				};
				
				$s.filter = function(nodes) {
					
					return $filter('search')(nodes, (model) => {
						return {
							value: model.title,
							childs: model.childs
						};
					}, $s.filterScope, true);
				};
				
				$s.removeCallback = function(parentList, index) {
					return function() {
						parentList.splice(index, 1);
						$s.$digest();
					};
				};
				
				$s.count = function(node, parent, depth) {
					return $s.options.levels[depth].getList(node).length;
				};
			}
		}
	}]);
})();