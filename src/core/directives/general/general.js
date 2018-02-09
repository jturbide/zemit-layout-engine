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
	// if(window.matchMedia('(pointer: coarse)').matches) {
	// 	Zemit.app.directive('ngDblclick', [function() {
	
	// 		var firstClickTime;
	// 		var dblTapInterval = 300;
	// 		var waitingSecondClick = false;
	
	// 		return {
	// 			restrict: 'A',
	// 			link: function ($s, $e, attrs) {
					
	// 				$e.bind('click', function (e) {
	
	// 					if (!waitingSecondClick) {
	// 						firstClickTime = (new Date()).getTime();
	// 						waitingSecondClick = true;
							
	// 						setTimeout(function () {
	// 							waitingSecondClick = false;
	// 						}, dblTapInterval);
	// 					}
	// 					else {
	// 						waitingSecondClick = false;
	
	// 						var time = (new Date()).getTime();
	// 						if (time - firstClickTime < dblTapInterval) {
	// 							$s.$apply(attrs.ngDblclick);
	// 						}
	// 					}
	// 				});
	// 			}
	// 		};
	// 	}]);
	// }
	
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
	 * Run expression of the user clicks outside the element
	 */
	Zemit.app.directive('zmActionOutside', ['$device', '$document', '$parse', '$util', function($device, $document, $parse, $util) {
		return {
			restrict: "A",
			link: function($s, $e, attrs) {
				
				var namespace = this.name + $util.s4();
				var eventName = attrs.zmActionOutsideEvent || 'mousedown';
				var eventHandler = function(event) {
					
					if(!event || !event.target
					|| $e.hasClass("ng-hide")) {
                        return;
                    }
                    
                    var $target = angular.element(event.target);
                    if($target.is($e) || $target.closest($e).length > 0) {
                    	return;
                    }
					
                    // OK, the user clicked outside. Run the expression
                    $parse(attrs['zmActionOutside'])($s, {
                    	event: event
                    });
                    $s.$digest();
				}
				
				var events = {
					enable: function() {
						
						this.disable();
						$document.on(eventName + '.' + namespace, eventHandler);
					},
					disable: function() {
						$document.off(eventName + '.' + namespace);
					}
				};
				
				if(attrs['zmActionOutsideIf']) {
					$s.$watch(attrs['zmActionOutsideIf'], function(nv, ov) {
						
						if(nv === ov) {
							return;
						}
						
						setTimeout(function() {
							if(nv) {
								events.enable();
							}
							else {
								events.disable();
							}	
						});
					});
				}
				
				$s.$on('$destroy', events.disable);
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
				$e.on('click', function(event) {
					$s.$eval(attrs.click);
					$s.$digest();
				});
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