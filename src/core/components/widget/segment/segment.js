/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Segment widget settings
	 */
	Zemit.app.onReady(['$i18n', function($i18n) {
		Zemit.widgets.init('segment', {
			injectable: {
				section: 'content',
				title: $i18n.get('core.components.widget.segment.title'),
				desc: $i18n.get('core.components.widget.segment.desc'),
				icon: 'cube',
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