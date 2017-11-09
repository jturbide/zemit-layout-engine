/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * General directives
	 */
	Zemit.app.directive('zmClickable', [function() {
		return {
			restrict: 'A',
			link: function ($s, $e, attrs) {
				
				$e.addClass('zm-clickable');
			}
		};
	}]);
	
	/**
	 * This directive solves the Angular other ng-dblclick directive
	 * for touch-based device only.
	 */
	if(window.matchMedia('(pointer: coarse)').matches) {
		Zemit.app.directive('ngDblclick', [function() {
	
			var firstClickTime;
			var dblTapInterval = 300;
			var waitingSecondClick = false;
	
			return {
				restrict: 'A',
				link: function ($s, $e, attrs) {
					
					$e.bind('click', function (e) {
	
						if (!waitingSecondClick) {
							firstClickTime = (new Date()).getTime();
							waitingSecondClick = true;
							
							setTimeout(function () {
								waitingSecondClick = false;
							}, dblTapInterval);
						}
						else {
							waitingSecondClick = false;
	
							var time = (new Date()).getTime();
							if (time - firstClickTime < dblTapInterval) {
								$s.$apply(attrs.ngDblclick);
							}
						}
					});
				}
			};
		}]);
	}
	
	/**
	 * General directives
	 */
	Zemit.app.directive('zmZoomable', [function() {
		return {
			restrict: 'A',
			link: function ($s, $e, attrs) {
				
				$e.addClass('zm-zoomable');
			}
		};
	}]);
	
	/**
	 * Accept widget inside
	 */
	Zemit.app.directive('zmAcceptWidgetInside', [function() {
		return {
			restrict: 'A',
			link: function ($s, $e, attrs) {
				
				var namespace = this.name;
				$e.addClass(namespace);
				
				$e.on('mouseout.' + namespace, function() {
					$s.isDropHover = false;
				});
				$e.on('mouseover.' + namespace, function(event) {
					$s.isDropHover = true;
				});
				// $e.on('dragHoverTouch.' + namespace, function(event) {
				// 	$s.isDropHover = true;
				// });
				
				$s.$watch('dropInsideIsActivated', function(nv, ov) {
					if(nv !== ov) {
						$e.toggleClass('zm-drop-inside-activate', nv);
					}
				});
				$s.$watch('dropInsideIsInvalid', function(nv, ov) {
					if(nv !== ov) {
						$e.toggleClass('zm-drop-inside-activate-invalid', nv);
					}
				});
			}
		};
	}]);
	
	/**
	 * Dynamically load directives
	 */
	Zemit.app.directive('zmDirective', ['$compile', function($compile) {
		return {
			restrict: "E",
			scope: {
				name: "="
			},
			link: function($s, $e, attrs) {
				$e.html('<zm-advanced-' + $s.name + '></zm-advanced-' + $s.name + '>');
				$compile($e.contents())($s);
			}
		};
	}]);
	
	/**
	 * Creates a button
	 */
	Zemit.app.directive('zmBtn', [function() {
		return {
			restrict: "E",
			link: function($s, $e, attrs) {
				
				$e.addClass('zm-btn');
				$e.on('mousedown', function(event) {
					event.preventDefault();
				});
				$e.on('click touch', function(event) {
					$s.$eval(attrs.click);
					$s.$digest();
				});
			}
		};
	}]);
	
	/**
	 * Creates a tooltip
	 */
	Zemit.app.directive('zmTooltip', [function() {
		return {
			restrict: "A",
			link: function($s, $e, attrs) {
				
				var $body = angular.element('body');
				
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
							$body.append($tooltip);
							
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
	
	/**
	 * Show/hide element
	 */
	Zemit.app.directive('zmVisible', [function() {
		return {
			restrict: 'A',
			scope: {
				visible: '=zmVisible'
			},
			link: function ($s, $e, attrs) {
				
				var applyClasses = function(visible) {
					
					$e.toggleClass('zm-visible', visible)
					  .toggleClass('zm-invisible', !visible);
				}
				
				$s.$watch('visible', function(nv, ov) {
					if(nv !== ov) {
						applyClasses(nv);
					}
				});
				
				applyClasses($s.visible);
			}
		};
	}]);
})();