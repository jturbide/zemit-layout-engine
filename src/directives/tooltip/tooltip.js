/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Creates a tooltip
	 */
	Zemit.app.directive('zmTooltip', [function() {
		return {
			restrict: "A",
			link: function($s, $e, attrs) {
				
				var $container = $e.parents('zemit:eq(0)');
				
				// Prepare the original tooltip element
				var $tooltip;
				var tooltipTimeout;
				var $oriTooltip = angular.element('<div />');
				var $oriTooltipInner = angular.element('<div />');
				var $oriTooltipPointer = angular.element('<div />');
				$oriTooltip.addClass('zm-tooltip');
				$oriTooltipInner.addClass('zm-tooltip-inner');
				$oriTooltipPointer.addClass('zm-tooltip-pointer');
				$oriTooltip.append($oriTooltipInner);
				$oriTooltip.append($oriTooltipPointer);
				
				if(!window.matchMedia('(pointer: coarse)').matches) {
					
					// Creates tooltip when mouse enter the element
					$e.on('mouseenter', function(event) {
						
						clearTimeout(tooltipTimeout);
						
						if(!$tooltip) {
							
							var offset = $e.offset();
							$tooltip = $oriTooltip.clone();
							$tooltip.children('.zm-tooltip-inner').html(attrs.zmTooltip);
							$container.append($tooltip);
							
							$tooltip.css('top', offset.top + $e.outerHeight());
							$tooltip.css('left', offset.left + ($e.outerWidth() / 2) - ($tooltip.outerWidth() / 2));
						}
						
						$tooltip.addClass('zm-visible').removeClass('zm-invisible');
					});
					
					// Hide and remove tooltip when mouse leave the element
					$e.on('mouseleave', function(event) {
						
						$tooltip.addClass('zm-invisible').removeClass('zm-visible');
						tooltipTimeout = setTimeout(function() {
							$tooltip.remove();
							$tooltip = null;
						}, 250);
					});
				}
			}
		};
	}]);
})();