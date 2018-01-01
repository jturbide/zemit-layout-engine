/**
 * Display childs widget directive
 * 
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Display a list of widget childs
	 */
	Zemit.app.directive('zmWidgetChilds', ['$zm', '$modal', function($zm, $modal) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'components/widget/default/childs/childs.html',
			link: function ($s, $e, attrs) {
				
				$s.$zm = $zm;
				$s.type = attrs.type;
				$s.defaultTemplate = attrs.defaultTemplate;
				
				/**
				 * Add a new widget at index position
				 */
				$s.add = function(index) {
					
					if($s.type) {
						$zm.action($s.widget.addChild, ['row', index], $s.widget);
					}
					else {
						$s.panel.open($s.widget, index);
					}
				};
				
				/**
				 * Add widget panel manager
				 */
				$s.panel = {
					
					open: function(widget, index) {
						
						$modal.open('zm_widget_add', {
							openFrom: '#' + (widget || $s.widget).id,
							data: {
								widget: widget || $s.widget,
								index: index
							}
						});
					}
				};
			}
		};
	}]);
})();