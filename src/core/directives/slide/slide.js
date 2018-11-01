/**
 * Slide Down
 */
Zemit.app.directive('zmSlideY', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		transclude: true,
		template: '<div class="zm-slide-container zm-slide" style="height: {{ styling.height}}px"><div class="zm-slide-inner" ng-transclude></div></div>',
		scope: {
			visible: '=zmSlideY'
		},
		link: function ($s, $e, attrs) {
			
			let $container = $e.children();
			$container.toggleClass('zm-slide-restricted', !$s.visible);
			
			$s.styling = {
				// zIndex: 0,
				height: !$s.visible ? 0 : null
			};
			
			$timeout(() => {
				
				$s.styling = {
					height: $s.visible
						? null
						: 0
				};
				
				// To prevent animation at load-time
				setTimeout(() => {
					$container.addClass('zm-slide-animate');
				});
			});
			
			$s.$watch('visible', (nv, ov) => {
				if(nv !== ov) {
					
					let height = $container.children().outerHeight(true);
					$container.addClass('zm-slide-restricted');
					
					if(!nv) {
						$s.styling.height = height;
					}
					
					// $s.styling.zIndex = !nv ? 0 : null;
					
					$timeout(() => {
						$s.styling.height = nv ? height : 0;
						
						setTimeout(() => {
							$s.styling.height = nv ? null : 0;
							
							if(nv) {
								$container.removeClass('zm-slide-restricted');
							}
						}, 250);
					});
				}
			});
		}
	};
}]);