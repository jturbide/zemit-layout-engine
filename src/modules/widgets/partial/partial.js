/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Partial widget settings
	 */
	Zemit.app.onReady(['$i18n', function($i18n) {
		Zemit.widgets.init('partial', {
			injectable: {
				section: 'customizable',
				title: $i18n.get('core.components.widget.partial.title'),
				desc: $i18n.get('core.components.widget.partial.desc'),
				icon: 'plug',
			},
			defaultAction: function($s, widget) {
				console.log($s, widget);
			},
			defaultValues: {
				url: null
			},
			controller: function($s, $e, $di, attrs) {
				
				
			}
		});
	}]);
})();