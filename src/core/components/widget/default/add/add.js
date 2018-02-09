/**
 * Add widget directive
 * 
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Initialize widget's requirement (once)
	 */
	Zemit.app.onReady(['$modal', '$i18n', function($modal, $i18n) {
		
		$modal.create('zm_widget_add', {
			title: $i18n.get('core.components.widget.default.add.modalAddTitle'),
			directive: 'zm-widget-modal-add',
			onOpen: (modal) => {
				modal.bodyScope.init();
			}
		});
	}]);
	
	/**
	 * Modal: Add a new widget
	 * 
	 * This modal offers a list of widget that you can add inside the column.
	 */
	Zemit.app.directive('zmWidgetModalAdd', ['$history', '$filter', '$zm', '$i18n', function($history, $filter, $zm, $i18n) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'core/components/widget/default/add/add.html',
			link: function ($s, $e, attrs) {
				
				var widgets = Zemit.widgets.getAll();
				
				$s.modal = $s.$parent.modal;
				
				$s.tab = {
					current: 'content'
				};
				
				/**
				 * Add a new widget in the column
				 */
				$s.addWidget = function(item) {
					
					$zm.action($s.modal.data.widget.addChild, [
						item.type,
						$s.modal.data.index, {
							defaultTemplate: item.defaultTemplate === false ? false : true
						}
					], $s.modal.data.widget);
					
					// Close modal
					$s.modal.close();
				};
				
				$s.init = () => {
					
					// List of available widgets (items)
					$s.items = {
						structure: {
							title: $i18n.get('core.components.widget.default.add.structure'),
							widgets: []
						},
						content: {
							title: $i18n.get('core.components.widget.default.add.content'),
							widgets: []
						},
						customizable: {
							title: $i18n.get('core.components.widget.default.add.customizable'),
							widgets: []
						}
						// custom: {
						// 	title: 'Custom',
						// 	widgets: []
						// }
					};
					
					angular.forEach(widgets, function(widget, key) {
						var inject = widget.injectable;
						if(inject && $s.items[inject.section]
						&& $s.modal.data.widget.acceptWidgetInside(widget)) {
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
				};
				
				$s.$emit('modalBodyReady', $s);
			}
		};
	}]);
})();