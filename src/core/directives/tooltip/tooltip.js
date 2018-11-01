/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Tooltip initialization
	 */
	Zemit.app.run(['$debug', '$hook', '$i18n', function($debug, $hook, $i18n) {
		$hook.add('onReady', () => $debug.init('tooltip', $i18n.get('core.directives.tooltip.debugTitle')));
	}]);
	
	/**
	 * Creates a tooltip
	 */
	Zemit.app.directive('zmTooltip', ['$util', '$debug', function($util, $debug) {
		return {
			restrict: "A",
			scope: {
				options: '=?zmTooltipOptions'
			},
			link: function($s, $e, attrs) {
				
				var guid = $util.guid();
				
				var $container = $e.parents('zemit:eq(0)');
				var $parent = $container;
				if($container.length === 0) {
					return;
				}
				
				let defaultOptions = {
					direction: 'bottom',
					parent: null,
					pointer: true,
					restraintToParent: false,
					condition: () => true,
					openTimeout: 0,
					closeTimeout: 0,
					offset: {
						y: 0,
						x: 0
					}
				};
				var options = $s.options || defaultOptions;
				if($s.options) {
					angular.extend(options, defaultOptions, angular.copy(options));
				}
				
				// Prepare the original tooltip element
				var $tooltip;
				var tooltipOpenTimeout;
				var tooltipCloseTimeout;
				var tooltipCloseTimeoutInit;
				var tooltipCloseTimeoutReady = false;
				
				let $oriTooltip = angular.element('<div />');
				let $oriTooltipInner = angular.element('<div />');
				let $oriTooltipPointer;
				$oriTooltip.addClass('zm-tooltip');
				$oriTooltipInner.addClass('zm-tooltip-inner');
				$oriTooltip.append($oriTooltipInner);
				
				if(options.pointer) {
					$oriTooltipPointer = angular.element('<div />');
					$oriTooltipPointer.addClass('zm-tooltip-pointer');
					$oriTooltip.append($oriTooltipPointer);
					$oriTooltip.addClass('zm-tooltip-has-pointer')
				}
				
				if(options.className) {
					$oriTooltip.addClass(options.className);
				}
				
				if(!window.matchMedia('(pointer: coarse)').matches) {
					
					let hideTooltip = (timeout = options.closeTimeout) => {
						
						clearTimeout(tooltipOpenTimeout);
						
						tooltipCloseTimeoutReady = true;
						tooltipCloseTimeoutInit = setTimeout(() => {
							if($tooltip && tooltipCloseTimeoutReady) {
								$debug.log('tooltip', 'INVISIBLE', attrs.zmTooltip);
								$tooltip.addClass('zm-invisible').removeClass('zm-visible');
								tooltipCloseTimeout = setTimeout(function() {
									$debug.log('tooltip', 'REMOVE', attrs.zmTooltip);
									if($tooltip) {
										$tooltip.remove();
										$tooltip = null;
									}
								}, 250);
							}
						}, timeout);
					};
					
					var updatePos = (top, left, $scrollContainer = false, $element = false) => {
						
						let minTop = ($scrollContainer && $scrollContainer.offset().top) || 0;
						let minLeft = ($scrollContainer && $scrollContainer.offset().left) || 0;
						let maxTop = (($scrollContainer && $scrollContainer.offset().top + $scrollContainer.outerHeight()) || window.innerHeight) - $tooltip.outerHeight(true);
						let maxLeft = (($scrollContainer && $scrollContainer.offset().left + $scrollContainer.outerWidth()) || window.innerWidth) - $tooltip.outerWidth(true);
						
						let newTop = top - ($scrollContainer && $scrollContainer.scrollTop());
						let newLeft = left - ($scrollContainer && $scrollContainer.scrollLeft());
						
						newTop = newTop < 0 ? 0 : newTop;
						newLeft = newLeft < 0 ? 0 : newLeft;
						newTop = newTop > maxTop ? maxTop : newTop;
						newLeft = newLeft > maxLeft ? maxLeft : newLeft;
						
						if(options.restraintToParent) {
							newTop = newTop < minTop ? minTop : newTop;
							newLeft = newLeft < minLeft ? minLeft : newLeft;
						}
						
						if(attrs.tooltipDistance) {
							newTop += parseInt(attrs.tooltipDistance);
							newLeft += parseInt(attrs.tooltipDistance);
						}
						
						$tooltip.toggleClass('zm-tooltip-affix-top', newTop === minTop);
						$tooltip.toggleClass('zm-tooltip-affix-bottom', newTop === maxTop);
						$tooltip.toggleClass('zm-tooltip-affix-left', newLeft === minLeft);
						$tooltip.toggleClass('zm-tooltip-affix-right', newLeft === maxLeft);
						
						$tooltip[0].style.transform = 'translateX(' + newLeft + 'px) translateY(' + newTop + 'px)';
						$tooltip.attr('data-top', top);
						$tooltip.attr('data-left', left);
						
						// Update pointer position
						if(options.pointer) {
							
							let $pointer = $tooltip.find('.zm-tooltip-pointer');
							
							let pointerNewMarginLeft = 0;
							let pointerNewMarginTop = 0;
							let eleOffset = $e.offset();
							
							if((newLeft <= minLeft) && (options.direction === 'top' || options.direction === 'bottom')) {
								pointerNewMarginLeft = left;
							}
							else if((newLeft >= maxLeft) && (options.direction === 'top' || options.direction === 'bottom')) {
								pointerNewMarginLeft = left;
							}
							if((newTop <= minTop) && (options.direction === 'left' || options.direction === 'right')) {
								pointerNewMarginTop = -(minTop - eleOffset.top - ($pointer.outerHeight() / 4));
							}
							else if((newTop >= maxTop) && (options.direction === 'left' || options.direction === 'right')) {
								pointerNewMarginTop = -(maxTop - eleOffset.top - ($pointer.outerHeight() / 4));
							}
							
							$pointer[0].style.transform = 'translateX(' + pointerNewMarginLeft + 'px) translateY(' + pointerNewMarginTop + 'px)';
						}
					}
					
					// Creates tooltip when mouse enter the element
					$e.on('mouseover.zmTooltip', function(event) {
						
						if(!options.condition()) {
							return;
						}
						
						// If a button or tab is active, it's not necessary to show
						// the tooltip..
						if($e.hasClass('active') || $e.parents('.active:eq(0)').length > 0) {
							return;
						}
						
						tooltipOpenTimeout = setTimeout(() => {
							
							tooltipCloseTimeoutReady = false;
							clearTimeout(tooltipCloseTimeout);
							clearTimeout(tooltipCloseTimeoutInit);
							
							if(!$tooltip && event.buttons === 0) {
								
								let bounding = $e[0].getBoundingClientRect();
								let position = $e.position();
								let width = $e.outerWidth();
								let height = $e.outerHeight();
								$tooltip = $oriTooltip.clone();
								$tooltip.children('.zm-tooltip-inner').html(attrs.zmTooltip);
								$container.append($tooltip);
								
								$tooltip.addClass('zm-tooltip-' + options.direction);
								
								// Invert if not enough space
								// if(direction === 'top' && bounding.y + height >= $container.offset().top + $container.outerHeight()) {
								// 	direction = 'bottom';
								// }
								// else if(direction === 'bottom' && bounding.y + height >= $container.offset().top + $container.outerHeight()) {
								// 	direction = 'top';
								// }
								
								let ePos = {
									top: bounding.y,
									left: bounding.x,
									halfWidth: (width / 2),
									halfHeight: (height / 2),
									width: width,
									height: height
								};
								
								let tSize = {
									halfHeight: ($tooltip.outerHeight(true) / 2),
									halfWidth: ($tooltip.outerWidth(true) / 2),
									width: $tooltip.outerWidth(true),
									height: $tooltip.outerHeight(true)
								};
								
								let cPos = {
									top: $container.offset().top + $parent.scrollTop(),
									left: $container.offset().left + $parent.scrollLeft()
								};
								
								let top = 0;
								let left = 0;
								
								switch(options.direction) {
									case 'top':
										top = bounding.top - tSize.height + cPos.top;
										left = bounding.left + ePos.halfWidth - tSize.halfWidth;
										break;
									case 'bottom':
										top = bounding.bottom - cPos.top;
										left = bounding.left + ePos.halfWidth - tSize.halfWidth;
										break;
									case 'left':
										top = bounding.top + ePos.halfHeight - tSize.halfHeight + cPos.top;
										left = bounding.left - tSize.width + cPos.left;
										break;
									case 'right':
										top = bounding.top + ePos.halfHeight - tSize.halfHeight + cPos.top;
										left = bounding.right + cPos.left;
										break;
								};
								
								if(options.offset.y && options.offset.y instanceof Function) {
									top += options.offset.y($tooltip, $parent);
								}
								else if(options.offset.y) {
									top += options.offset.y;
								}
								if(options.offset.x && options.offset.x instanceof Function) {
									left += options.offset.x($tooltip, $parent);
								}
								else if(options.offset.x) {
									left += options.offset.x;
								}
								
								updatePos(top, left, $parent);
							}
							
							if(event.buttons === 0) {
								$tooltip.addClass('zm-visible').removeClass('zm-invisible');
							}
							
							$debug.log('tooltip', 'OVER', attrs.zmTooltip);
							
						}, options.openTimeout);
					});
					
					// Hide and remove tooltip when mouse leave the element
					$e.on('mouseout.zmTooltip', function(event) {
						
						if(!options.condition()) {
							return;
						}
						
						if(!event.defaultPrevented) {
							hideTooltip();
						}
						
						$debug.log('tooltip', 'OUT', attrs.zmTooltip);
						
						event.preventDefault();
					});
					
					if(options.parent) {
						$parent = $e.parents(options.parent);
						
						if($parent.length === 0) {
							$parent = $container;
						}
						
						$parent.on('scroll.zmTooltip', (event) => {
							if(!$tooltip) {
								return;
							}
							
							updatePos(
								parseFloat($tooltip.attr('data-top')),
								parseFloat($tooltip.attr('data-left')),
								$parent
							);
						});
					}
					
					$s.$on('documentClick', () => hideTooltip(0));
					$s.$on('$destroy', () => hideTooltip(0));
				}
			}
		};
	}]);
})();