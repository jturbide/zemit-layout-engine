/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Media sidebar
	 */
	Zemit.app.directive('zmSidebarMedia', ['$media', '$device', function($media, $device) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/sidebar/media/media.html',
			link: ($s, $e, attrs) => {
				
				$s.medias = [];
				$s.draggableOptions = {
					container: $e.parents('zemit:eq(0)').find('.zm-container-scrollable:eq(0)')[0],
					onBeforeStart: () => {
						
						// If in portrait mode, close all sidebar tabs
						if($device.isSmall()) {
							$s.sidebar.tabs.hideAll();
						}
					},
					onEnd: () => {
						if($device.isSmall()) {
							$s.$apply(function() {
								$s.sidebar.tabs.unhideAll();
								$s.sidebar.tabs.closeAll();
							});
						}
					}
				};
				
				$s.loadMedias = () => {
					
					var images = [];
					$media.getAll().then((medias) => {
						angular.forEach(medias, (media) => {
							images.push({
								media: media,
								src: URL.createObjectURL(media.structure.sizes.thumbnail.data)
							});
						});
						$s.medias = {
							images: images
						};
					});
				};
				
				$s.loadMedias();
			}
		}
	}]);
})();