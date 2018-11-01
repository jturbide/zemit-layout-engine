/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Slide Down
	 */
	Zemit.app.directive('zmScrollable', ['$session', '$timeout', function($session, $timeout) {
		return {
			restrict: 'A',
			link: function ($s, $e, attrs) {
				
				let options = $s.$eval(attrs.zmScrollable);
				let settings = $session.get('settings');
				
				let settingsOpts = {};
				settingsOpts[options.key] = {
					y: 0,
					x: 0
				};
				$session.prepare('settings', {
					zmScrollable: settingsOpts
				});
				
				$e[0].addEventListener('scroll', (event) => {
					
					settings.zmScrollable[options.key].x = $e[0].scrollLeft;
					settings.zmScrollable[options.key].y = $e[0].scrollTop;
				});
				
				$timeout(() => {
					$e[0].scrollLeft = settings.zmScrollable[options.key].x;
					$e[0].scrollTop = settings.zmScrollable[options.key].y;
				});
				
				$e.addClass('zm-scrollable-' + options.direction);
			}
		};
	}]);
	
	/**
	 * If condition
	 */
	Zemit.app.directive('zmIf', ['$animate', '$compile', function($animate, $compile) {
		return {
			multiElement: true,
			transclude: 'element',
			priority: 600,
			terminal: true,
			restrict: 'A',
			$$tlb: true,
			link: function ($s, $e, attrs, ctrl, transclude) {
				
				function getBlockNodes(nodes) {
					// TODO(perf): update `nodes` instead of creating a new object?
					var node = nodes[0];
					var endNode = nodes[nodes.length - 1];
					var blockNodes;
				
					for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
						if (blockNodes || nodes[i] !== node) {
							if (!blockNodes) {
								blockNodes = jqLite(slice.call(nodes, 0, i));
							}
							blockNodes.push(node);
						}
					}
				
					return blockNodes || nodes;
				}
				
				var block, childScope, previousElements;
				$s.$watch(attrs.zmIf, function ngIfWatchAction(value) {
					
					if (value) {
						if (!childScope) {
							transclude(function(clone, newScope) {
								childScope = newScope;
								clone[clone.length++] =
									$compile.$$createComment('end ngIf', attrs.zmIf);
									
								block = { clone: clone };
								$animate.enter(clone, $e.parent(), $e);
							});
						}
					}
					else {
						
						let callback = () => {
							if (previousElements) {
								previousElements.remove();
								previousElements = null;
							}
							if (childScope) {
								childScope.$destroy();
								childScope = null;
							}
							if (block) {
								previousElements = getBlockNodes(block.clone);
								$animate.leave(previousElements).done(function(response) {
									if (response !== false) previousElements = null;
								});
								block = null;
							}
						}
						
						let timeout = parseInt($s.$eval(attrs.zmIfTimeout)) === 0 ? 0 : 250;
						timeout > 0 ? setTimeout(callback, timeout) : callback();
					}
				});
			}
		};
	}]);
	
	/**
	 * Fade-Out Kill directives
	 */
	Zemit.app.directive('zmFadeOutKill', ['$hook', function($hook) {
		return {
			restrict: 'A',
			scope: {
				configs: '=?zmFadeOutKill'
			},
			link: function ($s, $e, attrs) {
				
				let configs = $s.configs || {
					timeout: 250
				};
				
				let callback = () => {
					
					let timeout = attrs.zmFadeOutKill;
					setTimeout(() => {;
						$e.addClass('zm-hide');
						setTimeout(() => {
							$e.remove();
						}, configs.timeout);
					}, configs.timeout);
				}
				
				if(configs.hook) {
					$hook.add(configs.hook, callback);
				}
				
			}
		};
	}]);
	
	/**
	 * Show condition
	 */
	Zemit.app.directive('zmShow', ['$timeout', function($timeout) {
		return {
			restrict: 'A',
			link: function ($s, $e, attrs, ctrl, transclude) {
				
				let callback = () => {
					$e.toggleClass('zm-invisible', !$s.$eval(attrs.zmShow));
				};
				
				$s.$watch(attrs.zmShow, (nv, ov) => {
					if(nv !== ov) {
						let timeout = parseInt($s.$eval(attrs.zmShowTimeout)) === 0 ? 0 : 250;
							timeout > 0 ? setTimeout(callback, timeout) : callback();
					}
				});
				
				callback();
			}
		};
	}]);
	
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
	 * Invisible directives
	 */
	Zemit.app.directive('zmInvisible', [function() {
		return {
			restrict: 'A',
			link: function ($s, $e, attrs) {
				
				$s.$watch(attrs.zmInvisible, function(bool) {
					$e.toggleClass('zm-invisible', bool);
				});
			}
		};
	}]);
	
	/**
	 * Visible directives
	 */
	Zemit.app.directive('zmVisible', [function() {
		return {
			restrict: 'A',
			link: function ($s, $e, attrs) {
				
				$s.$watch(attrs.zmVisible, function(bool) {
					$e.toggleClass('zm-invisible', !bool);
				});
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
			restrict: "AE",
			link: function($s, $e, attrs) {
				
				var param = $s.$eval(attrs.name);
				$e.html('<' + param + '></' + param + '>');
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