/**
 * Add widget directive
 * 
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Initialize widget's requirement (once)
	 */
	Zemit.app.run(['$modal', function($modal) {
		
		$modal.create('zm_widget_add', {
			title: 'Add a new widget',
			content: '<zm-widget-modal-add />'
		});
	}]);
	
	/**
	 * Modal: Add a new widget
	 * 
	 * This modal offers a list of widget that you can add inside the column.
	 */
	Zemit.app.directive('zmWidgetModalAdd', ['$history', '$filter', '$zm', function($history, $filter, $zm) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'components/widget/default/add/add.html',
			link: function ($s, $e, attrs) {
				
				var widgets = Zemit.widgets.getAll();
				
				$s.modal = $s.$parent.modal;
				
				$s.tab = {
					current: 'content'
				};
				
				// List of available widgets (items)
				$s.items = {
					structure: {
						title: 'Structure',
						widgets: []
					},
					content: {
						title: 'Content',
						widgets: []
					},
					// custom: {
					// 	title: 'Custom',
					// 	widgets: []
					// }
				};
				
				angular.forEach(widgets, function(widget, key) {
					var inject = widget.injectable;
					if(inject && $s.items[inject.section]) {
						$s.items[widget.injectable.section].widgets.push({
							type: key,
							title: inject.title,
							desc: inject.desc,
							icon: inject.icon
						});
					}
				});
				
				angular.forEach($s.items, function(section) {
					section.rows = $filter('columnize')(section.widgets, 3);
				});
				
				/**
				 * Add a new widget in the column
				 */
				$s.addWidget = function(item) {
					
					$zm.action($s.modal.data.widget.addNewChild, [
						item.type,
						$s.modal.data.index, {
							defaultTemplate: item.defaultTemplate === false ? false : true
						}
					], $s.modal.data.widget);
					
					// Close modal
					$s.modal.close();
				};
			}
		};
	}]);
})();