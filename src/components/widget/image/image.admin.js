/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Image widget settings
	 */
	Zemit.widgets.init('image', {
		injectable: {
			section: 'content',
			title: 'Image',
			desc: 'Basic image',
			icon: 'image',
		},
		defaultValues: {
			src: null
		},
		settings: {
			title: 'Image',
			controller: function($s, $e, $di, attrs) {
				
			}
		},
		controller: function($s, $e, $di, attrs) {
			
			var $zm = $di.get('$zm');
			var $file = $di.get('$file');
			$file.drop.init($s.$element, $s, {
				supportedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
				onComplete: function(event, files) {
					
					$zm.action(function() {
						$s.widget.src = files[0].target.result;
					}, $s.widget);
				}
			});
		}
	});
})();