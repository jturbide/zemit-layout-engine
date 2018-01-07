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
			desc: 'A picture, icon or drawing',
			icon: 'image',
		},
		defaultAction: function($s, widget) {
			$s.promptFileDialog();
		},
		defaultValues: {
			mediaId: null
		},
		settings: {
			title: 'Image',
			controller: function($s, $e, $di, attrs) {
				
			}
		},
		controller: function($s, $e, $di, attrs) {
			
			var $zm = $di.get('$zm');
			var $file = $di.get('$file');
			var $media = $di.get('$media');
			
			var initMedia = (media) => {
				
				$s.src.original = URL.createObjectURL(media.getFile());
				angular.forEach(media.breakpoints, (size, name) => {
					$s.src[name] = URL.createObjectURL(media.structure.sizes[name].data);
				});
				
				$s.widget.mediaId = media.getId();
				$s.$digest();
			};
			
			$s.src = {};
			
			if($s.widget.mediaId) {
				$media.get($s.widget.mediaId).then(initMedia);
			}
			
			$s.promptFileDialog = function() {
				
				$file.promptFileDialog(function(file, data) {
					
					$zm.action(function() {
						$media.add(file).then(initMedia);
					}, $s.widget);
				}, 'image/jpeg,image/gif,image/png');
			};
			
			$s.dropzoneOptions = {
				accept: '.zm-media-item',
				onDrop: (media) => {
					$media.add(media.getFile()).then(initMedia);
				}
			};
			
			$file.drop.init($s.$element, $s, {
				supportedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
				onComplete: function(event, files) {
					$zm.action(function() {
						$media.add(files[0]).then(initMedia);
					}, $s.widget);
				}
			});
			
			$s.isLoaded = true;
		}
	});
})();