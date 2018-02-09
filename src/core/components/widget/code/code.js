/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Code widget settings
	 */
	Zemit.app.onReady(['$i18n', function($i18n) {
		Zemit.widgets.init('code', {
			injectable: {
				section: 'customizable',
				title: $i18n.get('core.components.widget.code.title'),
				desc: $i18n.get('core.components.widget.code.desc'),
				icon: 'code',
			},
			defaultAction: function($s, widget) {
				console.log($s, widget);
			},
			defaultValues: {
				css: null,
				js: null,
				html: null
			},
			controller: function($s, $e, $di, attrs) {
				
			}
		});
	}]);
})();