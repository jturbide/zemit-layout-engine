/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Container widget
	 */
	Zemit.widgets.init('container', {
		injectable: false,
		defaultTemplate: false,
		draggable: false,
		drop: {
			outside: {
				enabled: false
			},
			inside: {
				enabled: true,
				accept: ['row'],
				decline: false
			}
		},
		settings: {
			title: 'Container',
			controller: function($s, $e, $di, attrs) {
				
				
			}
		},
		controller: function($s, $e, $di, attrs) {
			
			var $zm = $di.get('$zm');
			
			// Set container scopes
			$s.zm = $zm;
			$s.container = $s.widget;
			
			// Add a placeholder element in the DOM next to the container
			var placeholder = document.createElement('div');
			placeholder.classList.add('zm-drop-placeholder');
			$e.parent().append(placeholder);
			$s.$placeholder = angular.element(placeholder);
			
			// Add a row if no widget available
			// if($s.container.childs.length === 0) {
			// 	$s.container.addNewChild('row');
			// }
		}
	});
})();