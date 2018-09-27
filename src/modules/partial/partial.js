/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	Zemit.module('partial', ['$i18n', function($i18n) {
		return {
			group: 'widget',
			onInit: () => {
				
				Zemit.widgets.register('modules/partial');
				
				Zemit.widgets.init('partial', {
					injectable: {
						section: 'customizable',
						title: $i18n.get('widget.partial.title'),
						desc: $i18n.get('widget.partial.desc'),
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
			}
		};
	}]);
})();