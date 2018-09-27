/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	Zemit.module('segment', ['$i18n', function($i18n) {
		return {
			group: 'widget',
			onInit: () => {
				
				Zemit.widgets.register('modules/segment');
				
				Zemit.widgets.init('segment', {
					injectable: {
						section: 'content',
						title: $i18n.get('widget.segment.title'),
						desc: $i18n.get('widget.segment.desc'),
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
			}
		};
	}]);
})();