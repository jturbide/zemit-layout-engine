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
		defaultAction: function($s, widget) {
			$s.promptFileDialog();
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
			
			$s.promptFileDialog = function() {
				
				$file.promptFileDialog(function(file, data) {
					var reader = new FileReader();
					reader.onload = function(event) {
						$zm.action(function() {
							$s.widget.src = reader.result;
							$s.$digest();
						}, $s.widget);
					}
					reader.readAsDataURL(file);
				}, 'image/jpeg,image/gif,image/png');
			}
			
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